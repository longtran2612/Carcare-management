package iuh.nhom7.khoa_luan_backend.utils;

import org.springframework.data.mongodb.core.query.Criteria;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class QueryBuilderUtils {

    public static void addStringValueByKey(Set<String> returnValue, Map<String, Object> questions, String key) {
        if (questions.containsKey(key)) {
            String value = (String) questions.getOrDefault(key, "");
            if (org.apache.commons.lang3.StringUtils.isNotBlank(value)) {
                returnValue.add(value);
            }
        }
    }

    public static void addDateFilter(List<Criteria> filterList, String fieldName, Date startDate, Date endDate) {
        if (startDate != null && endDate != null) {
            Criteria criteria = Criteria.where(fieldName).gte(startDate).lte(endDate);
            filterList.add(criteria);
        } else if (startDate != null) {
            Criteria criteria = Criteria.where(fieldName).gte(startDate);
            filterList.add(criteria);
        } else if (endDate != null) {
            Criteria criteria = Criteria.where(fieldName).lte(endDate);
            filterList.add(criteria);
        }
    }

    public static void addSingleValueFilter(List<Criteria> filterList, String fieldName, Object value) {
        if (value != null) {
            Criteria criteria = Criteria.where(fieldName).is(value);
            filterList.add(criteria);
        }
    }

    public static void addSingleRegexSearch(List<Criteria> filterList, String fieldName, String value) {
        if (value != null) {
            Criteria criteria = Criteria.where(fieldName).regex(value, "i");
            filterList.add(criteria);
        }
    }

    public static void addMultipleValuesFilter(List<Criteria> filterList, String fieldName, List<String> value) {
        if (org.apache.commons.collections4.CollectionUtils.isNotEmpty(value)) {
            Criteria criteria = Criteria.where(fieldName).in(value);
            filterList.add(criteria);
        }
    }
}
