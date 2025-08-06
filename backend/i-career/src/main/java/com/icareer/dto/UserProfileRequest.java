package com.icareer.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserProfileRequest implements Serializable {
	private static final long serialVersionUID = 2572900171853663268L;	
	/**
	 * List of user's interests (required)
	 */
	@NotNull
	@NotEmpty
	@Size(min = 1)
	private List<String> interests;
	/**
	 * List of suggested careers for the user
	 */
	private List<String> career_suggestions;
	/**
	 * Mapping from interest to possible careers
	 */
	private Map<String, List<String>> mapped_interest_to_careers;
	/**
	 * Justifications for each career
	 */
	private Map<String, String> career_justifications;
	/**
	 * Traits mapped to each interest
	 */
	private Map<String, List<String>> interest_traits;
	/**
	 * Confidence scores for each career
	 */
	private Map<String, Double> confidence_scores;
	/**
	 * User's values
	 */
	private List<String> values;
	/**
	 * User's emotional patterns
	 */
	private List<String> emotional_patterns;
	/**
	 * User's self-concept descriptors
	 */
	private List<String> self_concept_attributes;
	/**
	 * OCEAN (Big Five) personality traits
	 */
	private Map<String, Map<String, Object>> ocean_traits;
	/**
	 * Content themes from user's data
	 */
	private List<String> content_themes;
	/**
	 * Psychological insights
	 */
	private List<String> psychological_insights;
	
	private String error;
	
	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public List<String> getInterests() {
		return interests;
	}

	public void setInterests(List<String> interests) {
		this.interests = interests;
	}

	public List<String> getCareer_suggestions() {
		return career_suggestions;
	}

	public void setCareer_suggestions(List<String> career_suggestions) {
		this.career_suggestions = career_suggestions;
	}

	public Map<String, List<String>> getMapped_interest_to_careers() {
		return mapped_interest_to_careers;
	}

	public void setMapped_interest_to_careers(Map<String, List<String>> mapped_interest_to_careers) {
		this.mapped_interest_to_careers = mapped_interest_to_careers;
	}

	public Map<String, String> getCareer_justifications() {
		return career_justifications;
	}

	public void setCareer_justifications(Map<String, String> career_justifications) {
		this.career_justifications = career_justifications;
	}

	public Map<String, List<String>> getInterest_traits() {
		return interest_traits;
	}

	public void setInterest_traits(Map<String, List<String>> interest_traits) {
		this.interest_traits = interest_traits;
	}

	public Map<String, Double> getConfidence_scores() {
		return confidence_scores;
	}

	public void setConfidence_scores(Map<String, Double> confidence_scores) {
		this.confidence_scores = confidence_scores;
	}

	public List<String> getValues() {
		return values;
	}

	public void setValues(List<String> values) {
		this.values = values;
	}

	public List<String> getEmotional_patterns() {
		return emotional_patterns;
	}

	public void setEmotional_patterns(List<String> emotional_patterns) {
		this.emotional_patterns = emotional_patterns;
	}

	public List<String> getSelf_concept_attributes() {
		return self_concept_attributes;
	}

	public void setSelf_concept_attributes(List<String> self_concept_attributes) {
		this.self_concept_attributes = self_concept_attributes;
	}

	public Map<String, Map<String, Object>> getOcean_traits() {
		return ocean_traits;
	}

	public void setOcean_traits(Map<String, Map<String, Object>> ocean_traits) {
		this.ocean_traits = ocean_traits;
	}

	public List<String> getContent_themes() {
		return content_themes;
	}

	public void setContent_themes(List<String> content_themes) {
		this.content_themes = content_themes;
	}

	public List<String> getPsychological_insights() {
		return psychological_insights;
	}

	public void setPsychological_insights(List<String> psychological_insights) {
		this.psychological_insights = psychological_insights;
	}

	@Override
	public String toString() {
		return "UserProfileRequest{" +
				"interests=" + interests +
				", careerSuggestions=" + career_suggestions +
				", mappedInterestToCareers=" + mapped_interest_to_careers +
				", careerJustifications=" + career_justifications +
				", interestTraits=" + interest_traits +
				", confidenceScores=" + confidence_scores +
				", values=" + values +
				", emotionalPatterns=" + emotional_patterns +
				", selfConcept=" + self_concept_attributes +
				", oceanTraits=" + ocean_traits +
				", contentThemes=" + content_themes +
				", psychologicalInsights=" + psychological_insights +
				'}';
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		UserProfileRequest that = (UserProfileRequest) o;
		return Objects.equals(interests, that.interests) &&
				Objects.equals(career_suggestions, that.career_suggestions) &&
				Objects.equals(mapped_interest_to_careers, that.mapped_interest_to_careers) &&
				Objects.equals(career_justifications, that.career_justifications) &&
				Objects.equals(interest_traits, that.interest_traits) &&
				Objects.equals(confidence_scores, that.confidence_scores) &&
				Objects.equals(values, that.values) &&
				Objects.equals(emotional_patterns, that.emotional_patterns) &&
				Objects.equals(self_concept_attributes, that.self_concept_attributes) &&
				Objects.equals(ocean_traits, that.ocean_traits) &&
				Objects.equals(content_themes, that.content_themes) &&
				Objects.equals(psychological_insights, that.psychological_insights);
	}

	@Override
	public int hashCode() {
		return Objects.hash(interests, psychological_insights, mapped_interest_to_careers, career_justifications, interest_traits, confidence_scores, values, emotional_patterns, self_concept_attributes, ocean_traits, content_themes, psychological_insights);
	}
}