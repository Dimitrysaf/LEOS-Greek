package eu.europa.ec.digit.leos.pilot.export.service;

import eu.europa.ec.digit.leos.pilot.export.util.ExportOptions;

import java.util.Map;

public interface LegService {

    LegPackage createLegPackage(Map<String, Object> contentToZip, ExportOptions exportOptions) throws Exception;
}
