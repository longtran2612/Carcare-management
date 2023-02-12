package iuh.nhom7.khoa_luan_backend.config;

import com.mongodb.lang.NonNull;
import org.bson.types.Decimal128;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.convert.*;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;

/**
 * 9:15 AM 27-Apr-22
 * Long Tran
 **/
@Configuration
public class MongoConfig {

//    private  MongoDatabaseFactory mongoDbFactory;
//    private MongoMappingContext mongoMappingContext;
//
//    public MongoConfig(MongoDatabaseFactory mongoDbFactory,
//                       MongoMappingContext mongoMappingContext) {
//        this.mongoDbFactory = mongoDbFactory;
//        this.mongoMappingContext = mongoMappingContext;
//    }

//    @Bean  // bỏ _class ở database
//    public MappingMongoConverter mappingMongoConverter() {
//
//        DbRefResolver dbRefResolver = new DefaultDbRefResolver(mongoDbFactory);
//        MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, mongoMappingContext);
//        converter.setTypeMapper(new DefaultMongoTypeMapper(null));
//
//        return converter;
//    }

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(Arrays.asList(
                new BigDecimalDecimal128Converter(),
                new Decimal128BigDecimalConverter()
        ));

    }

    @WritingConverter
    private static class BigDecimalDecimal128Converter implements Converter<BigDecimal, Decimal128> {

        @Override
        public Decimal128 convert(@NonNull BigDecimal source) {
            if (source.scale() > 10) {
                return new Decimal128(source.setScale(10, RoundingMode.HALF_UP));
            } else {
                return new Decimal128(source);
            }
        }
    }

    @ReadingConverter
    private static class Decimal128BigDecimalConverter implements Converter<Decimal128, BigDecimal> {

        @Override
        public BigDecimal convert(@NonNull Decimal128 source) {
            return source.bigDecimalValue();
        }

    }
}