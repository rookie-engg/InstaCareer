package com.icareer.service;

import java.util.Optional;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.icareer.entity.User;
import com.icareer.entity.UserRequest;
import com.icareer.exception.ErrorMessage;
import com.icareer.exception.InstaCareerException;
import com.icareer.repository.UserRepository;
import com.icareer.utility.ValidationUtils;

@Service
public class UserServiceImpl implements UserService {

	UserRepository userRepository;

	private final BCryptPasswordEncoder bCryptPasswordEncoder;

	private final AuthenticationManager authenticationManager;

	private final JwtService jwtService;

	public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder,
			JwtService jwtService, AuthenticationManager authenticationManager) {
		super();
		this.userRepository = userRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
	}

	@Override
	public ResponseEntity<String> login(String email, String password) throws InstaCareerException {
		String emailError = ValidationUtils.validateEmail(email);
		String passwordError = ValidationUtils.validatePassword(password);
		JSONObject response = new JSONObject();

		if (emailError != null || passwordError != null)
			throw new InstaCareerException(
					new ErrorMessage(HttpStatus.BAD_REQUEST.value(), emailError + " " + passwordError));

//		return userRepository.existsByEmailAndPassword(email, password);
		Authentication authenticate = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(email, password));

		if (authenticate.isAuthenticated()) {
			User user = userRepository.findByEmail(email).orElseThrow(() -> new InstaCareerException(
					new ErrorMessage(HttpStatus.UNAUTHORIZED.value(), "User not found.")));

			response.put("id", user.getId().toString());
			response.put("role", user.getRole().toString());
			response.put("token", jwtService.generateToken(email));

			return ResponseEntity.ok(response.toString());
		}

		return new ResponseEntity<>(response.toString(), HttpStatus.UNAUTHORIZED);
	}

	@Override
	public User register(User user) throws InstaCareerException {
		String emailError = ValidationUtils.validateEmail(user.getEmail());
		String passwordError = ValidationUtils.validatePassword(user.getPassword());

		if (emailError != null || passwordError != null)
			throw new InstaCareerException(
					new ErrorMessage(HttpStatus.BAD_REQUEST.value(), emailError + " " + passwordError));

		if (user.getUserRequests() != null) {
			for (UserRequest request : user.getUserRequests()) {
				request.setUser(user); // set the parent user reference
			}
		}

		// Ensure role is set to USER by default if not specified
		if (user.getRole() == null) {
			user.setRole(User.Role.USER);
		}

		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
//		return userRepository.saveAndFlush(user);
	}

	@Override
	public Boolean deleteUser(String id) {
		userRepository.deleteById(UUID.fromString(id));
		return true;
	}

	@Override
	public User updateUser(User user, String id) throws InstaCareerException {
		Optional<User> existingUser = userRepository.findById(UUID.fromString(id));

		if (!existingUser.isPresent()) {
			throw new InstaCareerException(
					new ErrorMessage(HttpStatus.BAD_REQUEST.value(), "User not found with id: " + id));
		}

		// Ensure the ID remains the same
		user.setId(existingUser.get().getId());

		if (user.getEmail() == null || user.getEmail().isEmpty()) {
			user.setEmail(existingUser.get().getEmail());
		}
		if (user.getName() == null || user.getName().isEmpty()) {
			user.setName(existingUser.get().getName());
		}
		if (user.getPassword() == null || user.getPassword().isEmpty()) {
			user.setPassword(existingUser.get().getPassword());
		}

		return userRepository.saveAndFlush(user);
	}

}