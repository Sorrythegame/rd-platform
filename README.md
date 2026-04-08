# rd-platform README.md

# rd-platform（研发管理平台）

本项目为研发管理平台，核心用于研发团队的人员管理、组织架构维护等相关业务，提供员工信息、系统用户的基础数据存储与管理能力，支撑研发团队日常运营与管理工作。

## 一、项目概述

### 1.1 项目定位

研发管理平台（rd-platform）聚焦研发团队的组织架构与人员信息管理，实现员工基础信息、部门归属、岗位角色等数据的统一维护，为后续研发流程、任务分配等功能提供数据支撑。

### 1.2 核心功能

- 系统用户管理：维护平台登录用户的账号密码信息

- 员工组织架构管理：存储员工基本信息、部门归属、组织层级、岗位角色、技术栈等核心数据

- 基础数据查询：支持通过部门、组织、员工姓名、员工状态等维度快速查询员工信息

## 二、环境要求

### 2.1 运行环境

- 数据库：MySQL 8.0+（推荐 8.0.20 及以上版本）

- JDK：1.8 及以上（若为Java项目）

- 依赖管理：Maven/Gradle（若为Java项目）

- 开发工具：IntelliJ IDEA/Eclipse（推荐IDEA）、DBeaver（数据库管理）

### 2.2 数据库连接注意事项

若连接数据库时出现 `Public Key Retrieval is not allowed` 报错，解决方案如下：

- 方法1：编辑数据库连接 → 驱动属性 → 将 `allowPublicKeyRetrieval` 值改为 `true`

- 方法2：修改JDBC URL，追加参数：`?allowPublicKeyRetrieval=true&useSSL=false`

## 三、数据库初始化

项目启动前，需先执行以下SQL脚本，完成数据库、数据表的创建与初始化，脚本可直接复制到DBeaver等工具执行。

### 3.1 创建数据库

```sql
-- 创建研发管理平台数据库，统一字符集为utf8mb4，避免中文乱码
CREATE DATABASE `rd_platform` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
-- 切换至目标数据库
USE rd_platform;
```

### 3.2 创建系统用户表（sys_user） 用于测试项目启动及简单数据库功能连接

```sql
-- 系统用户表：存储平台登录用户信息
CREATE TABLE `sys_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID（自增主键）',
  `username` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '登录用户名',
  `password` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '登录密码（建议加密存储）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='系统用户表';
```

### 3.3 创建员工信息表（staff）

```sql
-- 员工组织架构信息表：存储员工基础信息与组织归属
CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `serial_num` varchar(255) DEFAULT NULL COMMENT '员工序号',
  `belong_dept` varchar(255) DEFAULT NULL COMMENT '所属部门',
  `first_group` varchar(255) DEFAULT NULL COMMENT '一级组织',
  `second_group` varchar(255) DEFAULT NULL COMMENT '二级组织',
  `third_group` varchar(255) DEFAULT NULL COMMENT '三级组织',
  `staff_name` varchar(255) DEFAULT NULL COMMENT '员工姓名',
  `hr_code` varchar(255) DEFAULT NULL COMMENT 'HR编码（员工唯一标识）',
  `team_leader` varchar(255) DEFAULT NULL COMMENT '团队负责人姓名',
  `staff_attr` varchar(255) DEFAULT NULL COMMENT '员工属性（如正式/实习/外包等）',
  `belong_company` varchar(255) DEFAULT NULL COMMENT '所属公司',
  `city` varchar(255) DEFAULT NULL COMMENT '所在城市',
  `actual_work_place` varchar(255) DEFAULT NULL COMMENT '实际工作地点',
  `job_role` varchar(255) DEFAULT NULL COMMENT '岗位角色（如开发/测试/产品等）',
  `tech_stack` varchar(255) DEFAULT NULL COMMENT '掌握技术栈（如Java/MySQL/前端等）',
  `staff_status` varchar(255) DEFAULT NULL COMMENT '员工状态（如在职/离职/休假等）',
  `product_line_26` varchar(50) DEFAULT NULL COMMENT '26年产线',
  `direction_26` varchar(50) DEFAULT NULL COMMENT '26年工作方向',
  `input_sub_product` varchar(255) DEFAULT NULL COMMENT '录入子产品',
  `xinghe_maas_support` varchar(255) DEFAULT NULL COMMENT '星河Maas支持相关',
  `direction26` varchar(255) DEFAULT NULL COMMENT '26年补充方向',
  `product_line26` varchar(255) DEFAULT NULL COMMENT '26年产线补充信息',
  PRIMARY KEY (`id`),
  -- 索引优化：提升常用查询效率
  KEY `idx_belong_dept` (`belong_dept`) USING BTREE COMMENT '所属部门索引',
  KEY `idx_first_group` (`first_group`) USING BTREE COMMENT '一级组织索引',
  KEY `idx_staff_name` (`staff_name`) USING BTREE COMMENT '员工姓名索引',
  KEY `idx_staff_status` (`staff_status`) USING BTREE COMMENT '员工状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='员工组织架构信息表';
```
