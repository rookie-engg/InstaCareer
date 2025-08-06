package com.icareer.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class UserProfileKafkaPayload implements Serializable {
	private static final long serialVersionUID = -1245079380554063265L;

	private String id;
	private List<Description> raw_descritions;
	private List<Description> cleaned_descriptions;
	private String model_promt;
	private UserProfileRequest model_res;

	public UserProfileKafkaPayload() {
		super();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<Description> getRaw_descritions() {
		return raw_descritions;
	}

	public void setRaw_descritions(List<Description> raw_descritions) {
		this.raw_descritions = raw_descritions;
	}

	public List<Description> getCleaned_descriptions() {
		return cleaned_descriptions;
	}

	public void setCleaned_descriptions(List<Description> cleaned_descriptions) {
		this.cleaned_descriptions = cleaned_descriptions;
	}

	public String getModel_promt() {
		return model_promt;
	}

	public void setModel_promt(String model_promt) {
		this.model_promt = model_promt;
	}

	public UserProfileRequest getModel_res() {
		return model_res;
	}

	public void setModel_res(Object model_res) {
		if (model_res instanceof String) {
			try {
				ObjectMapper mapper = new ObjectMapper();
				this.model_res = mapper.readValue((String) model_res, UserProfileRequest.class);
			} catch (JsonProcessingException e) {
				throw new RuntimeException("Failed to parse model_res JSON string", e);
			}
		} else if (model_res instanceof UserProfileRequest) {
			this.model_res = (UserProfileRequest) model_res;
		} else {
			this.model_res = null;
		}
	}

	@Override
	public String toString() {
		return "UserProfileKafkaPayload [id=" + id + ", raw_descritions=" + raw_descritions + ", cleaned_descriptions="
				+ cleaned_descriptions + ", model_promt=" + model_promt + ", model_res=" + model_res + "]";
	}
	
	public String toJson() {
	    try {
	        return new ObjectMapper().writeValueAsString(this);
	    } catch (JsonProcessingException e) {
	        throw new RuntimeException("Failed to serialize UserProfileKafkaPayload", e);
	    }
	}

}