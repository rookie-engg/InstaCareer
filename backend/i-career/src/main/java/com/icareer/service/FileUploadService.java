package com.icareer.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.icareer.entity.RequestStatus;
import com.icareer.entity.UserRequest;
import com.icareer.repository.UserRequestRepository;
import com.icareer.service.UserProfileStatusService.UserProfileStatus;

//@EnableAsync
@Service
public class FileUploadService {
	
	@Autowired
	private UserProfileStatusService userProfileStatus;
	
	@Autowired
	UserRequestRepository UserRequestRepository;

	@Value("${file.upload-dir:uploads}")
	private final String uploadDir;	

	private final KafkaProducerService kafkaProducerService;
	
	private UserRequest userRequest;

	private final int MAX_TASKS = 22;
	private final double SEARCH_HISTORY_PERCENT = 0.3;

	public FileUploadService(KafkaProducerService kafkaProducerService, @Value("${file.upload-dir:uploads}") String uploadDir) {
		this.kafkaProducerService = kafkaProducerService;
		this.uploadDir = uploadDir;
	}

	public void handleZipUpload(UserRequest userRequest2, MultipartFile file) throws IOException {
		this.userRequest = userRequest2;

		Path uploadPath = Paths.get(uploadDir);
		Files.createDirectories(uploadPath);
		Path filePath = uploadPath.resolve(file.getOriginalFilename());
		Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
		
		userProfileStatus.setStatus(userRequest.getId().toString(), UserProfileStatus.PENDING);
		
		userRequest.setZipFilePath(filePath.toString());		
		UserRequestRepository.saveAndFlush(userRequest);
		
		YouTubeActivityExtractor(file, userRequest.getId().toString());
		
//		return userRequest;
//		return correlatedId + " - ZIP file uploaded successfully: " + file.getOriginalFilename();
	}
	
//	@Async
	private void YouTubeActivityExtractor(MultipartFile file, String correlatedId) throws IOException {
		userRequest.setStatus(RequestStatus.PROCESSING);
		UserRequestRepository.saveAndFlush(userRequest);
		
		File uploadedZip = new File(uploadDir, file.getOriginalFilename());
		
		if (!uploadedZip.exists()) {
			System.err.println("Uploaded ZIP file not found: " + uploadedZip.getAbsolutePath());
			return;
		}

		List<JSONObject> searchHistoryList = new ArrayList<>();
		List<JSONObject> watchHistoryList = new ArrayList<>();

		try (ZipInputStream zis = new ZipInputStream(new FileInputStream(uploadedZip))) {
			ZipEntry entry;
			while ((entry = zis.getNextEntry()) != null) {
				if (entry.getName().endsWith("search-history.json")) {
					byte[] entryBytes = zis.readAllBytes();
					try (InputStream entryStream = new java.io.ByteArrayInputStream(entryBytes)) {
						streamJsonArray(entryStream, searchHistoryList::add);
					}
				} else if (entry.getName().endsWith("watch-history.json")) {
					byte[] entryBytes = zis.readAllBytes();
					try (InputStream entryStream = new java.io.ByteArrayInputStream(entryBytes)) {
						streamJsonArray(entryStream, watchHistoryList::add);
					}
				}
			}
		}

		sendJSONResponseToKafka(searchHistoryList, watchHistoryList, correlatedId);
	}

	private void sendJSONResponseToKafka(List<JSONObject> searchHistoryList, List<JSONObject> watchHistoryList, String correlatedId) {
		if (searchHistoryList.isEmpty() && watchHistoryList.isEmpty()) {
			System.err.println("Required JSON files not found in the ZIP archive or are empty.");
			return;
		}

		int searchCount = (int) Math.ceil(MAX_TASKS * SEARCH_HISTORY_PERCENT);
		int watchCount = MAX_TASKS - searchCount;

		List<JSONObject> tasks = new ArrayList<>();
		extractRandomTasksFromList(searchHistoryList, searchCount, tasks);
		extractRandomTasksFromList(watchHistoryList, watchCount, tasks);

		JSONObject response = new JSONObject();

		JSONArray activities = new JSONArray(tasks);
		response.put("id", correlatedId);
		response.put("activities", activities);

		userProfileStatus.setStatus(correlatedId, UserProfileStatus.PENDING);
		System.out.println(userProfileStatus.getStatus(correlatedId).get());
		// Send to Kafka
		kafkaProducerService.send(response.toString(2));
	}

	// New helper to extract random tasks from a List<JSONObject>
	private void extractRandomTasksFromList(List<JSONObject> source, int count, List<JSONObject> target) {
		List<JSONObject> validTasks = new ArrayList<>();
		
		for (JSONObject obj : source) {
			if (obj.has("title") && obj.has("titleUrl")) {
				JSONObject task = new JSONObject();
				task.put("title", obj.getString("title"));
				task.put("titleUrl", obj.getString("titleUrl"));
				validTasks.add(task);
			}
		}
		Collections.shuffle(validTasks);
		for (int i = 0; i < Math.min(count, validTasks.size()); i++) {
			target.add(validTasks.get(i));
		}
	}

	// Helper to read InputStream into a String
	/*
	 * private static String readStream(InputStream in) throws IOException {
	 * BufferedReader reader = new BufferedReader(new InputStreamReader(in,
	 * StandardCharsets.UTF_8)); StringBuilder sb = new StringBuilder(); String
	 * line; while ((line = reader.readLine()) != null) { sb.append(line.trim()); }
	 * return sb.toString(); }
	 */

	
	private void streamJsonArray(InputStream in, Consumer<JSONObject> consumer) throws IOException {
        // ObjectMapper is a powerful Jackson class for reading JSON
        ObjectMapper mapper = new ObjectMapper();
        JsonFactory factory = mapper.getFactory();

        try (JsonParser parser = factory.createParser(in)) {
            // Make sure the file starts with an array token '['
            if (parser.nextToken() != JsonToken.START_ARRAY) {
                System.err.println("Error: JSON file is not a valid array.");
                return;
            }

            // Loop through the array tokens
            while (parser.nextToken() != JsonToken.END_ARRAY) {
                // Check if the current token is the start of an object '{'
                if (parser.currentToken() == JsonToken.START_OBJECT) {
                    // Use the ObjectMapper to automatically read the entire complex object.
                    // This is the key change that fixes the parsing issue.
                    java.util.Map<String, Object> map = mapper.readValue(parser,
                            new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>() {});

                    // Convert the resulting Map into the JSONObject the rest of your code expects
                    JSONObject obj = new JSONObject(map);

//                    System.out.println("Parsed object: " + obj.toString(2)); // Pretty-print for clarity
                    consumer.accept(obj);
                }
            }
        }
    }
	
	// Helper to stream JSON array entries from InputStream using Jackson
	/*
	private void streamJsonArray(InputStream in, Consumer<JSONObject> consumer) throws IOException {
		JsonFactory factory = new JsonFactory();
		
		try (JsonParser parser = factory.createParser(in)) {
			// Move to start of array
			while (!parser.isClosed()) {
				JsonToken token = parser.nextToken();
				
				if (token == JsonToken.START_ARRAY) {
					break;
				}
			}
			// Process each object in array
			while (parser.nextToken() == JsonToken.START_OBJECT) {
				JSONObject obj = new JSONObject();
				while (parser.nextToken() != JsonToken.END_OBJECT) {
//                    String fieldName = parser.getCurrentName();
					String fieldName = parser.currentName();
					if(fieldName != null) {
						parser.nextToken();
						obj.put(fieldName, parser.getText());
					}
				}
				consumer.accept(obj);
			}
		}
	}
	*/
}