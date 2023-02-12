package iuh.nhom7.khoa_luan_backend.utils;

import iuh.nhom7.khoa_luan_backend.base.BasePageRequest;
import iuh.nhom7.khoa_luan_backend.base.BaseSort;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Arrays;
import java.util.List;

public class PageableUtils {

    public static Pageable convertPageable(BasePageRequest pageRequest, String[] sorts) {
        Sort sort = null;
        Pageable pageable;
        if (sorts != null) {
            for (String item : sorts) {
                List<String> elephantList = Arrays.asList(item.split(","));
                String value = elephantList.get(0);
                String asc = elephantList.size() == 1 ? null : elephantList.get(1);
                if (asc != null) {
                    if (asc.equals("DESC")) {
                        sort = null == sort ? Sort.by(value).descending() : sort.and(Sort.by(value).descending());
                    } else {
                        sort = null == sort ? Sort.by(value) : sort.and(Sort.by(value));
                    }
                } else if (!value.equals("DESC") && !value.equals("ASC")) {
                    sort = (sort == null) ? Sort.by(value) : sort.and(Sort.by(value));
                }
            }
            pageable = PageRequest.of(pageRequest.getPageNumber(), pageRequest.getPageSize(), sort);
        } else {
            pageable = PageRequest.of(pageRequest.getPageNumber(), pageRequest.getPageSize());
        }
        return pageable;
    }

    public static Pageable convertPageable(Integer pageNumber, Integer pageSize) {
        Sort sort = null;
        Pageable pageable;
        pageable = PageRequest.of(pageNumber, pageSize);
        return pageable;
    }

    public static Pageable convertPageableAndSort(Integer pageNumber, Integer pageSize, List<BaseSort> sorts) {
        Sort sort = null;
        Pageable pageable;
        if (sorts != null && sorts.size() > 0) {
            for (BaseSort item : sorts) {
                if (!item.getAsc()) {
                    sort = (sort == null) ? Sort.by(item.getKey()).descending() : sort.and(Sort.by(item.getKey()).descending());
                } else {
                    sort = (sort == null) ? Sort.by(item.getKey()) : sort.and(Sort.by(item.getKey()));
                }
            }
            pageable = PageRequest.of(pageNumber, pageSize, sort);
        } else {
            pageable = PageRequest.of(pageNumber, pageSize);
        }
        return pageable;
    }

}
