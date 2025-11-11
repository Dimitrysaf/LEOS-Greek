package eu.europa.ec.leos.services.utils;
/*
 * Copyright 2024 European Union
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence")
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *     https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and limitations under the Licence.
 */

import eu.europa.ec.leos.services.structure.StructureContext;
import eu.europa.ec.leos.services.structure.lang.LanguageMapHolder;
import eu.europa.ec.leos.vo.structure.AknTag;
import eu.europa.ec.leos.vo.structure.Attribute;
import eu.europa.ec.leos.vo.structure.AutoNumbering;
import eu.europa.ec.leos.vo.structure.LangNumConfig;
import eu.europa.ec.leos.vo.structure.Level;
import eu.europa.ec.leos.vo.structure.NumberingConfig;
import eu.europa.ec.leos.vo.structure.NumberingType;
import eu.europa.ec.leos.vo.structure.SubElementNumberingConfig;
import eu.europa.ec.leos.vo.structure.SubElementNumberingConfigs;
import eu.europa.ec.leos.vo.structure.TocItem;
import eu.europa.ec.leos.vo.structure.TocItemType;
import eu.europa.ec.leos.vo.structure.TocItemTypeName;
import eu.europa.ec.leos.vo.structure.TocItemTypes;
import org.apache.commons.lang3.StringUtils;

import jakarta.inject.Provider;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.apache.commons.collections.CollectionUtils.isNotEmpty;

public class StructureConfigUtils {
    private StructureConfigUtils() {
    }

    public static final String NUM_HEADING_SEPARATOR = " - ";
    public static final String HASH_NUM_VALUE = "#";
    public static final String CONTENT_SEPARATOR = " ";
    private static final String NUMBERING_TYPE = "NumberingType '";

    public static List<TocItemType> getTocItemTypesByTagName(List<TocItem> tocItems, String tagName) {
        TocItem tocItem = getTocItemByName(tocItems, tagName);
        if (tocItem != null && tocItem.getTocItemTypes() != null) {
            return tocItem.getTocItemTypes().getTocItemTypes();
        }
        return Arrays.asList();
    }

    public static NumberingType getNumberingTypeByTagNameAndTocItemType(List<TocItem> tocItems, TocItemTypeName tocItemType,
            String subElementTagName, String language) {
        List<TocItem> subElementTocItems = getTocItemsByName(tocItems, subElementTagName);
        if (subElementTocItems.size() > 1 && subElementTocItems.get(0).getParentNameNumberingTypeDependency() != null) {
            TocItem parentTocItem = getTocItemByName(tocItems, subElementTocItems.get(0).getParentNameNumberingTypeDependency().value());
            if(parentTocItem != null && parentTocItem.getTocItemTypes() != null
                    && isNotEmpty(parentTocItem.getTocItemTypes().getTocItemTypes())) {
                for (TocItemType tocItemTyp : parentTocItem.getTocItemTypes().getTocItemTypes()) {
                    if (tocItemTyp.getName().equals(tocItemType)) {
                        return getNumberingTypeFromSubElementNumberingConfigs(tocItems, subElementTagName, tocItemTyp.getSubElementNumberingConfigs(), language);
                    }
                }
            }
        } else if (!subElementTocItems.isEmpty()) {
            return getNumberingTypeByLanguage(subElementTocItems.get(0), language);
        }
        return null;
    }

    public static TocItem getTocItemByTagNameAndTocItemType(List<TocItem> tocItems, TocItemTypeName tocItemType,
            String subElementTagName, String language) {
        List<TocItem> subElementTocItems = getTocItemsByName(tocItems, subElementTagName);
        if (subElementTocItems.size() > 1 && subElementTocItems.get(0).getParentNameNumberingTypeDependency() != null) {
            TocItem parentTocItem = getTocItemByName(tocItems, subElementTocItems.get(0).getParentNameNumberingTypeDependency().value());
            if(parentTocItem != null && parentTocItem.getTocItemTypes() != null
                    && isNotEmpty(parentTocItem.getTocItemTypes().getTocItemTypes())){
                for (TocItemType tocItemTyp : parentTocItem.getTocItemTypes().getTocItemTypes()) {
                    if (tocItemTyp.getName().equals(tocItemType)) {
                        NumberingType numberingType = getNumberingTypeFromSubElementNumberingConfigs(tocItems, subElementTagName,
                                tocItemTyp.getSubElementNumberingConfigs(), language);
                        return getTocItemByNumberingType(tocItems, numberingType, subElementTagName, language);
                    }
                }
            }
        } else if (!subElementTocItems.isEmpty()) {
            return subElementTocItems.get(0);
        }
        return null;
    }

    public static Attribute getAttributeByTagNameAndTocItemType(List<TocItem> tocItems, TocItemTypeName tocItemType, String tagName) {
        TocItem tocItem = getTocItemByName(tocItems, tagName);
        if (tocItem != null && tocItem.getTocItemTypes() != null) {
            for (TocItemType tocItemTyp : tocItem.getTocItemTypes().getTocItemTypes()) {
                if (tocItemTyp.getName().equals(tocItemType)) {
                    return tocItemTyp.getAttribute();
                }
            }
        }
        return null;
    }

    public static Map<TocItemTypeName, List<Level>> getNumberingConfigsFromTocItem(List<NumberingConfig> numberingConfigs, List<TocItem> tocItems,
            String tagName, String language) {
        List<TocItem> foundTocItems = getTocItemsByName(tocItems, tagName);
        Map<TocItemTypeName, List<Level>> foundNumberingConfigs = new EnumMap<>(TocItemTypeName.class);
        if (foundTocItems.size() == 1) {
            //TODO: pass the document language
            NumberingConfig numberingConfig = getNumberingConfig(numberingConfigs, getNumberingTypeByLanguage(foundTocItems.get(0), language));
            foundNumberingConfigs.put(TocItemTypeName.REGULAR, numberingConfig != null ? numberingConfig.getLevels().getLevels() : null);
        } else if (foundTocItems.size() > 1 && foundTocItems.get(0).getParentNameNumberingTypeDependency() != null) {
            TocItem tocItem = getTocItemByName(tocItems, foundTocItems.get(0).getParentNameNumberingTypeDependency().value());
            if (tocItem != null) {
                for (TocItemType tocItemTyp : tocItem.getTocItemTypes().getTocItemTypes()) {
                    TocItemTypeName tocItemType = tocItemTyp.getName();
                    SubElementNumberingConfigs subElementNumberingConfigs = tocItemTyp.getSubElementNumberingConfigs();
                    if (!subElementNumberingConfigs.getSubElementNumberingConfigs().isEmpty()) {
                        for (SubElementNumberingConfig subElementNumberingConfig : subElementNumberingConfigs.getSubElementNumberingConfigs()) {
                            if (subElementNumberingConfig.getSubElement().value().equals(tagName)) {
                                String group = LanguageMapUtils.getLanguageGroup(LanguageMapHolder.getLanguageMap(), language);
                                LangNumConfig langNumConfig = subElementNumberingConfig.getLangNumConfigs().stream().filter(numConfig -> numConfig.getLangGroup().equalsIgnoreCase(group)).findFirst().get();
                                NumberingConfig numberingConfig = getNumberingConfig(numberingConfigs, langNumConfig.getNumberingTypes().get(0));
                                foundNumberingConfigs.put(tocItemType, numberingConfig != null ? numberingConfig.getLevels().getLevels() : null);
                            }
                        }
                    }
                }
            }
        }
        return foundNumberingConfigs;
    }

    private static NumberingType getNumberingTypeFromSubElementNumberingConfigs(List<TocItem> tocItems,
            String subElementTagName,
            SubElementNumberingConfigs subElementNumberingConfigs, String language) {
        if (subElementNumberingConfigs != null && !subElementNumberingConfigs.getSubElementNumberingConfigs().isEmpty()) {
            for (SubElementNumberingConfig subElementNumberingConfig : subElementNumberingConfigs.getSubElementNumberingConfigs()) {
                if (subElementNumberingConfig.getSubElement().value().equals(subElementTagName)) {
                    return getNumberingTypeByLangConfigAndLanguage(subElementNumberingConfig.getLangNumConfigs(), language);
                }
            }
        }
        TocItem tocItem = getTocItemByName(tocItems, subElementTagName);
        if (tocItem != null) {
            return getNumberingTypeByLanguage(tocItem, language);
        }
        return null;
    }

    public static TocItemTypeName getTocItemTypeFromTagNameAndAttributes(List<TocItem> tocItems, String tagName, Map<String, String> attributes) {
        TocItem tocItem = getTocItemByName(tocItems, tagName);
        TocItemTypeName tocItemType = TocItemTypeName.REGULAR;
        if (tocItem != null && tocItem.getTocItemTypes() != null) {
            for (TocItemType tocItemTyp : tocItem.getTocItemTypes().getTocItemTypes()) {
                if (tocItemTyp.getAttribute() != null
                        && attributes.containsKey(tocItemTyp.getAttribute().getAttributeName())
                        && attributes.get(tocItemTyp.getAttribute().getAttributeName()).equals(tocItemTyp.getAttribute().getAttributeValue())) {
                    return tocItemTyp.getName();
                }
            }
        }
        return tocItemType;
    }

    public static TocItem getTocItemByName(Provider<StructureContext> structureContextProvider, AknTag aknTag) {
        List<TocItem> tocItems = structureContextProvider.get().getTocItems();
        return tocItems.stream()
                .filter(tocItem -> tocItem.getAknTag().value().equalsIgnoreCase(aknTag.value()))
                .findFirst()
                .orElse(null);
    }

    public static TocItem getTocItemByName(Provider<StructureContext> structureContextProvider, String tagName) {
        List<TocItem> tocItems = structureContextProvider.get().getTocItems();
        return tocItems.stream()
                .filter(tocItem -> tocItem.getAknTag().value().equalsIgnoreCase(tagName) || tocItem.getAknTag().name().equalsIgnoreCase(tagName))
                .findFirst()
                .orElse(null);
    }

    public static TocItem getTocItemByName(List<TocItem> tocItems, AknTag aknTag) {
        return tocItems.stream()
                .filter(tocItem -> tocItem.getAknTag().value().equalsIgnoreCase(aknTag.value()) || tocItem.getAknTag().value().equalsIgnoreCase(aknTag.name()))
                .findFirst()
                .orElse(null);
    }

    public static TocItem getTocItemByName(List<TocItem> tocItems, String tagName) {
        return tocItems.stream()
                .filter(tocItem -> tocItem.getAknTag().value().equalsIgnoreCase(tagName) || tocItem.getAknTag().name().equalsIgnoreCase(tagName))
                .findFirst()
                .orElse(null);
    }

    public static TocItem getTocItemByNameOrThrow(List<TocItem> tocItems, String tagName) {
        return tocItems.stream()
                .filter(tocItem -> tocItem.getAknTag().value().equalsIgnoreCase(tagName) ||  tocItem.getAknTag().name().equalsIgnoreCase(tagName))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("TocItem '" + tagName + "' not present in the list of Items [" + getTocItemNamesAsList(tocItems) + "]"));
    }

    public static List<String> getTocItemNamesAsList(List<TocItem> tocItems) {
        return tocItems.stream()
                .map(tocItem -> tocItem.getAknTag().value())
                .collect(Collectors.toList());
    }

    public static List<TocItem> getTocItemsByName(List<TocItem> tocItems, String tagName) {
        return tocItems.stream()
                .filter(tocItem -> tocItem.getAknTag().value().equalsIgnoreCase(tagName) || tocItem.getAknTag().name().equalsIgnoreCase(tagName))
                .collect(Collectors.toList());
    }

    public static TocItem getTocItemByNumberingType(List<TocItem> tocItems, NumberingType numType, String tagName, String language) {
        return tocItems.stream()
                .filter(tocItem -> (tocItem.getAknTag().name().equalsIgnoreCase(tagName) || tocItem.getAknTag().value().equalsIgnoreCase(tagName)) && getNumberingTypeByLanguage(tocItem, language).equals(numType)).findFirst()
                .orElseThrow(() -> new IllegalStateException(NUMBERING_TYPE + numType + "' not present in the list of TocItems [" + tocItems + "]"));
    }

    public static TocItem getTocItemByNumValue(List<NumberingConfig> numberingConfigs, List<TocItem> foundTocItems, String numValue, int depth,
            String language) {
        List<NumberingType> numberingTypes = getNumberingTypesBySequence(numberingConfigs, numValue);
        return foundTocItems.stream()
                .filter(tocItem -> {
                    NumberingConfig tocItemNumberingConfig = getNumberingConfig(numberingConfigs, getNumberingTypeByLanguage(tocItem, language));
                    return tocItemNumberingConfig != null && (isNumberingTypeMatchesSequence(numberingConfigs, getNumberingTypeByLanguage(tocItem, language), numValue)
                            || isNumberingTypesPartOfNumberingConfig(numberingTypes, tocItemNumberingConfig, depth));
                })
                .findFirst()
                .orElse(null);
    }

    private static boolean isNumberingTypesPartOfNumberingConfig(List<NumberingType> numberingTypes, NumberingConfig numberingConfig, int depth) {
        if (!numberingTypes.isEmpty() && numberingConfig.getLevels() != null && !numberingConfig.getLevels().getLevels().isEmpty()) {
            return numberingConfig.getLevels().getLevels().stream().anyMatch(level -> level.getDepth() == depth && numberingTypes.contains(level.getNumberingType()));
        }
        return false;
    }

    public static NumberingConfig getNumberingByName(List<NumberingConfig> numberingConfigs, NumberingType numType) {
        return numberingConfigs.stream()
                .filter(config -> config.getType().equals(numType)).findFirst()
                .orElseThrow(() -> new IllegalStateException(NUMBERING_TYPE + numType + "' not present in the list of NumberingConfigs [" + numberingConfigs + "]"));
    }

    public static NumberingType getNumberingTypeByDepth(NumberingConfig numberingConfig, int depth) {
        if (numberingConfig.getLevels() == null) {
            return numberingConfig.getType();
        } else {
            return numberingConfig.getLevels().getLevels().stream()
                    .filter(level -> level.getDepth() == depth).findFirst()
                    .map(Level::getNumberingType)
                    .orElseThrow(() -> new IllegalStateException("Depth '" + depth + "' not defined in the NumberingConfig [" + numberingConfig + "]"));
        }
    }

    public static int getDepthByNumberingType(List<NumberingConfig> numberingConfigs, NumberingType numberingType) {
        final NumberingConfig pointNumberingConfig = numberingConfigs.stream()
                .filter(config -> config.getType() == NumberingType.POINT_NUM)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(NUMBERING_TYPE + NumberingType.POINT_NUM + "' not defined in the NumberingConfigs [" + numberingConfigs + "]"));
        return pointNumberingConfig.getLevels().getLevels().stream().filter(level -> level.getNumberingType() == numberingType)
                .findFirst()
                .map(Level::getDepth)
                .orElseThrow(() -> new IllegalStateException(NUMBERING_TYPE + numberingType + "' not defined in the NumberingConfig [" + pointNumberingConfig + "]"));
    }

    public static NumberingConfig getNumberingConfig(List<NumberingConfig> numberConfigs, NumberingType numType) {
        return numberConfigs.stream()
                .filter(numberingConfig -> numberingConfig.getType().equals(numType))
                .findFirst()
                .orElse(null);
    }
    
    public static NumberingConfig getNumberingConfigByTagName(List<TocItem> items, List<NumberingConfig> numberingConfigs, String tagName,
            String language) {
        TocItem tocItem = getTocItemByName(items, tagName);
        return getNumberingByName(numberingConfigs, tocItem != null ? getNumberingTypeByLanguage(tocItem, language) : null);
    }

    public static NumberingType getNumberingTypeBySequence(List<NumberingConfig> numberingConfigs, String sequence) {
        NumberingConfig numberingConfig = numberingConfigs.stream()
                .filter(numberConfig -> {
                    if (StringUtils.isNotBlank(numberConfig.getSequence())) {
                        String numValueToCompare = "";
                        if (numberConfig.getPrefix() != null) {
                            numValueToCompare += numberConfig.getPrefix();
                        }
                        numValueToCompare += numberConfig.getSequence();
                        if (numberConfig.getSuffix() != null) {
                            numValueToCompare += numberConfig.getSuffix();
                        }

                        return (numValueToCompare.equalsIgnoreCase(sequence));
                    }
                    return false;
                })
                .findFirst()
                .orElse(null);
        if (numberingConfig == null) {
            return null;
        }
        return numberingConfig.getType();
    }

    public static List<NumberingType> getNumberingTypesBySequence(List<NumberingConfig> numberingConfigs, String sequence) {
        List<NumberingConfig> matchingNumberingConfigs = numberingConfigs.stream()
                .filter(numberConfig -> {
                    if (StringUtils.isNotBlank(numberConfig.getSequence())) {
                        String numValueToCompare = "";
                        if (numberConfig.getPrefix() != null) {
                            numValueToCompare += numberConfig.getPrefix();
                        }
                        numValueToCompare += numberConfig.getSequence();
                        if (numberConfig.getSuffix() != null) {
                            numValueToCompare += numberConfig.getSuffix();
                        }
                        if (numValueToCompare.equalsIgnoreCase(sequence)) {
                            return true;
                        } else if (StringUtils.isNotBlank(numberConfig.getRegex())
                                && isNumValueWithPrefixAndSuffix(sequence, numberConfig)) {
                            Pattern pattern = Pattern.compile(numberConfig.getRegex());
                            String num = getNumValueWithoutPrefixAndSuffix(sequence, numberConfig);
                            Matcher matcher = pattern.matcher(num);
                            return matcher.find() && StringUtils.isNotBlank(matcher.group(0));
                        }
                    }
                    return false;
                }).collect(Collectors.toList());
        return matchingNumberingConfigs.stream().map(nc -> nc.getType()).collect(Collectors.toList());
    }

    private static boolean isNumberingTypeMatchesSequence(List<NumberingConfig> numberingConfigs, NumberingType numberingType, String numValue) {
        NumberingConfig numberingConfig = getNumberingConfig(numberingConfigs, numberingType);
        String numValueWithoutPrefixAndSuffix = numberingConfig != null ? getNumValueWithoutPrefixAndSuffix(numValue, numberingConfig) : numValue;
        return (numberingConfig != null && isNumValueWithPrefixAndSuffix(numValue, numberingConfig) &&
                numberingConfig.getSequence() != null
                && numberingConfig.getSequence().equalsIgnoreCase(numValueWithoutPrefixAndSuffix));
    }

    private static boolean isNumValueWithPrefixAndSuffix(final String numValue, final NumberingConfig numberingConfig) {
        if (numberingConfig.getPrefix() != null && !numberingConfig.getPrefix().isEmpty() && !numValue.startsWith(numberingConfig.getPrefix())) {
            return false;
        }
        return numberingConfig.getSuffix() == null || numberingConfig.getSuffix().isEmpty() || numValue.endsWith(numberingConfig.getSuffix());
    }

    private static String getNumValueWithoutPrefixAndSuffix(String numValue, NumberingConfig numberingConfig) {
        String numValueWithoutPrefixAndSuffix = numValue;
        if (numberingConfig.getPrefix() != null && !numberingConfig.getPrefix().isEmpty() && numValueWithoutPrefixAndSuffix.startsWith(numberingConfig.getPrefix())) {
            numValueWithoutPrefixAndSuffix = numValueWithoutPrefixAndSuffix.substring(numberingConfig.getPrefix().length());
        }
        if (numberingConfig.getSuffix() != null && !numberingConfig.getSuffix().isEmpty() && numValueWithoutPrefixAndSuffix.endsWith(numberingConfig.getSuffix())) {
            numValueWithoutPrefixAndSuffix = numValueWithoutPrefixAndSuffix.substring(0, numValue.length() - numberingConfig.getSuffix().length() - 1);
        }
        return numValueWithoutPrefixAndSuffix;
    }

    public static boolean isAutoNumberingEnabled(List<TocItem> tocItems, String elementName, String language) {
        TocItem tocItem = getTocItemByName(tocItems, elementName);
        AutoNumbering autoNumbering = tocItem != null ? tocItem.getAutoNumbering() : null;
        return autoNumbering != null && (getLangNumConfigByLanguage(autoNumbering.getLangNumConfigs(), language).isAuto());
    }

    public static LangNumConfig getLangNumConfigByLanguage(List<LangNumConfig> langNumConfigs, String lang) {
        String group = LanguageMapUtils.getLanguageGroup(LanguageMapHolder.getLanguageMap(), lang);
        return langNumConfigs.stream().filter(config ->
                config.getLangGroup().equalsIgnoreCase(group)).findFirst().get();
    }

    public static NumberingType getNumberingTypeByLanguage(TocItem tocItem, String language) {
        NumberingType numberingType = NumberingType.NONE;
        if(tocItem != null && tocItem.getAutoNumbering() != null) {
            String group = LanguageMapUtils.getLanguageGroup(LanguageMapHolder.getLanguageMap(), language);
            Optional<LangNumConfig> langNumConfig = tocItem.getAutoNumbering().getLangNumConfigs().stream().filter(config ->
                    config.getLangGroup().equalsIgnoreCase(group)).findFirst();
            if (langNumConfig.isPresent()) {
                numberingType = langNumConfig.get().getNumberingTypes().get(0);
            }
        }
        return numberingType;
    }

    public static NumberingType getNumberingTypeByLanguage(AutoNumbering autoNumbering, String language) {
        NumberingType numberingType = NumberingType.NONE;
        if(autoNumbering != null) {
            String group = LanguageMapUtils.getLanguageGroup(LanguageMapHolder.getLanguageMap(), language);
            Optional<LangNumConfig> langNumConfig = autoNumbering.getLangNumConfigs().stream().filter(config ->
                    config.getLangGroup().equalsIgnoreCase(group)).findFirst();
            if (langNumConfig.isPresent()) {
                numberingType = langNumConfig.get().getNumberingTypes().get(0);
            }
        }
        return numberingType;
    }

    public static NumberingType getSoleNumberingTypeByLanguage(TocItem tocItem, String language) {
        NumberingType numberingType = NumberingType.NONE;
        if(tocItem.getSoleNumbering() != null) {
            String group = LanguageMapUtils.getLanguageGroup(LanguageMapHolder.getLanguageMap(), language);
            Optional<LangNumConfig> langNumConfig = tocItem.getSoleNumbering().getLangNumConfigs().stream().filter(config ->
                    config.getLangGroup().equalsIgnoreCase(group)).findFirst();
            if (langNumConfig.isPresent()) {
                numberingType = langNumConfig.get().getNumberingTypes().get(0);
            }
        }
        return numberingType;
    }

    private static NumberingType getNumberingTypeByLangConfigAndLanguage(List<LangNumConfig> langNumConfigs, String lang) {
        NumberingType numberingType;
        String group = LanguageMapUtils.getLanguageGroup(LanguageMapHolder.getLanguageMap(), lang);
        numberingType = langNumConfigs.stream().filter(config ->
                config.getLangGroup().equalsIgnoreCase(group)).findFirst().get().getNumberingTypes().get(0);

        return numberingType;
    }

    public static List<String> findTocItemsWithElementAsSubElement(List<TocItem> tocItems, String elementName) {
        if (tocItems == null || elementName == null) {
            return Collections.emptyList();
        }

        return tocItems.stream()
                .filter(Objects::nonNull)
                .filter(tocItem ->
                        Optional.ofNullable(tocItem.getTocItemTypes())
                                .map(TocItemTypes::getTocItemTypes)
                                .orElse(Collections.emptyList()).stream()
                                .filter(Objects::nonNull)
                                .anyMatch(tocItemType ->
                                        Optional.ofNullable(tocItemType.getSubElementNumberingConfigs())
                                                .map(SubElementNumberingConfigs::getSubElementNumberingConfigs)
                                                .orElse(Collections.emptyList()).stream()
                                                .filter(Objects::nonNull)
                                                .anyMatch(cfg -> elementName.equals(cfg.getSubElement().value()))
                                )
                )
                .map(tocItem -> tocItem.getAknTag().value())
                .collect(Collectors.toList());
    }

    public static List<Attribute> findAttributeValueOfElementType(List<TocItem> tocItems, String elementName) {
        if (tocItems == null || elementName == null) {
            return Collections.emptyList();
        }
        return getTocItemTypesByTagName(tocItems, elementName).stream().filter(Objects::nonNull)
                .map(TocItemType::getAttribute)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public static NumberingType findNumberingTypeForAttribute(
            List<TocItem> tocItems, Attribute attribute, String elementName, String language) {
        NumberingType defaultNumType = null;
        for (TocItem tocItem : tocItems) {
            if (tocItem.getTocItemTypes() != null) {
                for (TocItemType tocItemType : tocItem.getTocItemTypes().getTocItemTypes()) {
                    NumberingType numberingType = getNumberingTypeFromSubElementNumberingConfigs(
                            tocItems, elementName, tocItemType.getSubElementNumberingConfigs(), language);
                    if (attribute != null && tocItemType.getAttribute() != null
                            && attribute.getAttributeName().equals(tocItemType.getAttribute().getAttributeName())
                            && attribute.getAttributeValue().equals(tocItemType.getAttribute().getAttributeValue())) {
                        return numberingType;
                    }
                    if (defaultNumType == null) {
                        defaultNumType = numberingType;
                    }
                }
            }
        }
        return defaultNumType;
    }
}
