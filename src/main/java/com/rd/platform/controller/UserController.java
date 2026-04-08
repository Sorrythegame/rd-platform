package com.rd.platform.controller;

import com.rd.platform.common.result.Result;
import com.rd.platform.entity.Staff;
import com.rd.platform.entity.User;
import com.rd.platform.service.StaffService;
import com.rd.platform.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.alibaba.excel.EasyExcel;

import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    // 构造器注入，生产级推荐（无@Autowired）
    private final UserService userService;
    private final StaffService staffRepository;

    public UserController(UserService userService, StaffService staffRepository) {
        this.userService = userService;
        this.staffRepository = staffRepository;
    }

    // 查询所有用户接口
    @GetMapping("/list")
    public Result<List<User>> list() {
        return Result.success(userService.list());
    }

    // 上传表格数据
    @PostMapping("/upload/excel")
    public String uploadExcel(@RequestParam("file") MultipartFile file) throws Exception {
        InputStream inputStream = file.getInputStream();

        // 读取Excel所有数据
        List<Staff> list = EasyExcel.read(inputStream)
                .head(Staff.class)
                .sheet()
                .doReadSync();

        // 批量保存到数据库
        staffRepository.saveBatch(list);

        return "上传成功！共导入 " + list.size() + " 条数据";
    }

    @GetMapping("/getAllStaff")
    public Result<List<Staff>> findAllStaffOrg() {
        return Result.success(staffRepository.list());
    }
}