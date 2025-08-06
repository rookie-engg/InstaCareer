package com.icareer.utility;

public class ValidationUtils {
	private static final String EMAIL_EMPTY_MSG = "Email must not be empty.";
	private static final String EMAIL_LENGTH_MSG = "Email must be at least 5 characters long.";
	private static final String EMAIL_FORMAT_MSG = "Invalid email format.";
	private static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

	private static final String PASSWORD_EMPTY_MSG = "Password must not be empty.";
	private static final String PASSWORD_LENGTH_MSG = "Password must be at least 6 characters long.";
	private static final String PASSWORD_COMPLEXITY_MSG = "Password must contain at least one uppercase letter, one lowercase letter, and one digit.";

	private static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$";

	public static String validateEmail(String email) {
		StringBuilder errorMessage = new StringBuilder();

		if (email == null || email.trim().isEmpty()) {
			errorMessage.append(EMAIL_EMPTY_MSG).append(" ");
		} else {
			if (email.length() < 5)
				errorMessage.append(EMAIL_LENGTH_MSG).append(" ");

			if (!email.matches(EMAIL_REGEX))
				errorMessage.append(EMAIL_FORMAT_MSG).append(" ");
		}

		if (errorMessage.length() > 0)
			errorMessage.toString().trim();

		return null;
	}

	public static String validatePassword(String password) {
        StringBuilder errorBuilder = new StringBuilder();

        if (password == null || password.trim().isEmpty()) {
            errorBuilder.append(PASSWORD_EMPTY_MSG).append(" ");
        } else {
            if (password.length() < 6) {
                errorBuilder.append(PASSWORD_LENGTH_MSG).append(" ");
            }

            if (!password.matches(PASSWORD_REGEX)) {
                errorBuilder.append(PASSWORD_COMPLEXITY_MSG).append(" ");
            }
        }

        if (errorBuilder.length() > 0) 
            return errorBuilder.toString().trim();

        return null;
    }
}