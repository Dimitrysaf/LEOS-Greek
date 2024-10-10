package eu.europa.ec.leos.model.xml;

import java.util.Objects;

public class Element {

	private String elementId;
	private String elementTagName;
	private String elementFragment;
	private String alternateElementId;

	public Element(String elementId, String elementTagName, String elementFragment) {
		this.elementId = elementId;
		this.elementTagName = elementTagName;
		this.elementFragment = elementFragment;
	}

	public Element(String elementId, String elementTagName, String elementFragment, String alternateElementId) {
		this(elementId, elementTagName, elementFragment);
		this.alternateElementId = alternateElementId;
	}

	public String getElementId() {
		return elementId;
	}

	public String getElementTagName() {
		return elementTagName;
	}

	public String getElementFragment() {
		return elementFragment;
	}

	public String getAlternateElementId() {
		return alternateElementId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		Element element = (Element) o;
		return Objects.equals(elementId, element.elementId) && Objects.equals(elementTagName, element.elementTagName);
	}

	@Override
	public int hashCode() {
		int result = Objects.hashCode(elementId);
		result = 31 * result + Objects.hashCode(elementTagName);
		return result;
	}
}
