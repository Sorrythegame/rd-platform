package com.rd.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("staff")
public class Staff {

    // 主键
    @TableId(type = IdType.AUTO)
    private Integer id;

    private String serialNum;      // 序号
    private String belongDept;     // 归属部门
    private String firstGroup;     // 一级组
    private String secondGroup;    // 二级组
    private String thirdGroup;     // 三级组
    private String staffName;      // 员工
    private String hrCode;         // 人力编码
    private String teamLeader;     // 组长
    private String staffAttr;      // 属性
    private String belongCompany;  // 所属公司
    private String city;           // 城市
    private String actualWorkPlace;// 实际工作地点
    private String jobRole;        // 岗位
    private String techStack;      // 技术栈
    private String staffStatus;    // 状态
    private String productLine26;  // 26年产线
    private String direction26;    // 26年方向
    private String inputSubProduct;// 投入子产品
    private String xingheMaasSupport; // 星河平台
}