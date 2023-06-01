package eu.europa.ec.leos.notice.frontend.csv;

import eu.europa.ec.leos.notice.common.TxtLinesReader;

import java.io.IOException;
import java.io.Reader;
import java.util.Collection;
import java.util.Objects;
import java.util.stream.Collectors;

public class CsvToCsvLibrariesConverter {
    public Collection<CsvLibrary> convertCsv(Reader reader) throws IOException {
        Objects.requireNonNull(reader);

        CsvLineToCsvLibraryConverter lineConverter = new CsvLineToCsvLibraryConverter();
        return readAllLines(reader)
                .stream()
                .skip(1)
                .filter(line -> line.trim().length() > 0)
                .map(lineConverter::convert)
                .collect(Collectors.toList());
    }

    private Collection<String> readAllLines(Reader reader) throws IOException {
        return new TxtLinesReader(reader).readAllLines();
    }
}
