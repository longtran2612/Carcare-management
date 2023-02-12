package iuh.nhom7.khoa_luan_backend.model.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;

/**
 * 8:34 PM 17-Sep-22
 * Long Tran
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParameterSearchService implements Serializable, Cloneable {

    private String id;
    private String type;
    private String name;
    private String categoryId;
    private String status;
    private Date createDate;
    private String createBy;
    private Date updateDate;
    private Date fromDate;
    private Date toDate;

    private Collection<String> ids;
    private Collection<String> ignoresIds;
    private Collection<String> categoryIds;

    private Boolean count;
    //  page

    private Long startIndex;

    private Integer maxResult;

    private String sortField;

    private Boolean descSort;




}
