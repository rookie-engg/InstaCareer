package com.icareer.exception;

import org.springframework.http.HttpStatus;

public class InstaCareerException extends Exception {
	private static final long serialVersionUID = -878709961754331051L;

	private ErrorMessage errorMessage; 
	
	public InstaCareerException() {
		super();
		this.errorMessage = new ErrorMessage();
		this.errorMessage.setMessage("An unknown InstaCareer error occurred.");
		this.errorMessage.setErrorCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
	}
	
	public InstaCareerException(String message) {
		super(message);
		this.errorMessage = new ErrorMessage();
		this.errorMessage.setMessage(message);
		this.errorMessage.setErrorCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
	}
	
	public InstaCareerException(ErrorMessage errorMessage) {
		super(errorMessage != null ? errorMessage.getMessage() : "An unexpected error occurred."); 
		this.errorMessage = errorMessage;
	}

	public ErrorMessage getErrorMessage() {
		return errorMessage;
	}
}