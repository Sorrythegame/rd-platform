package com.rd.platform.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.rd.platform.entity.User;
import org.apache.ibatis.annotations.Mapper;

// MyBatis-Plus基础Mapper，自带增删改查
@Mapper
public interface UserMapper extends BaseMapper<User> {
}