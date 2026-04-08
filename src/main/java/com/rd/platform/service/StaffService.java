package com.rd.platform.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.rd.platform.entity.Staff;

// 继承MyBatis-Plus的IService，自带批量操作
public interface StaffService extends IService<Staff> {
}