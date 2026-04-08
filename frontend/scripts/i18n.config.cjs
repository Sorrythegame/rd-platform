// i18n 脚本配置文件
module.exports = {
  // 扫描文件模式
  scanPatterns: [
    'src/**/*.vue',
    'src/**/*.ts',
    'src/**/*.js',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],

  // 忽略扫描的目录/文件
  ignorePatterns: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '**/test/**',
    '**/tests/**',
    '**/*.test.*',
    '**/*.spec.*',
  ],

  // 语言文件配置
  locales: {
    dir: 'src/i18n/locales',
    languages: ['zh-CN', 'en-US'],
    defaultLanguage: 'zh-CN',
  },

  // 中文匹配正则
  chineseRegex: /[\u4e00-\u9fa5]/,

  // i18n使用匹配正则
  i18nUsageRegex: /(?:t|i18n\.t|\$t)\s*\(\s*['"`]([^'"`]+)['"`]/g,

  // 排除的中文文本模式（不需要国际化的场景）
  excludeChinesePatterns: [
    // 注释中的中文
    /\/\/.*[\u4e00-\u9fa5]/,
    /\/\*[\s\S]*?[\u4e00-\u9fa5][\s\S]*?\*\//,

    // console.log 中的中文
    /console\.(log|warn|error|info)\s*\([^)]*[\u4e00-\u9fa5]/,

    // 配置文件中的描述
    /description\s*:\s*['"`][^'"`]*[\u4e00-\u9fa5]/,
    /title\s*:\s*['"`][^'"`]*[\u4e00-\u9fa5]/,

    // package.json 等配置
    /name\s*:\s*['"`][^'"`]*[\u4e00-\u9fa5]/,
  ],

  // 自动翻译配置
  translation: {
    // 自动翻译服务配置（可选）
    enabled: false,
    service: 'google', // google, baidu, youdao
    apiKey: '', // API密钥

    // 翻译质量提示
    qualityCheck: true,

    // 是否需要人工审核自动翻译
    requireReview: true,
  },

  // 输出配置
  output: {
    // 是否使用颜色输出
    colors: true,

    // 详细输出
    verbose: false,

    // 导出检查结果到文件
    exportFile: false,
    exportPath: 'i18n-report.json',
  },

  // 自动生成key的配置
  keyGeneration: {
    // key生成策略: 'hash' | 'semantic' | 'manual'
    strategy: 'semantic',

    // 语义化key的前缀
    keyPrefix: '',

    // 最大key长度
    maxKeyLength: 100,

    // key分隔符
    separator: '.',

    // 自动推断key的类别
    autoCategory: true,

    // 常见分类映射
    categoryMapping: {
      button: ['按钮', '确认', '取消', '提交', '保存'],
      message: ['成功', '失败', '错误', '警告'],
      label: ['标签', '名称', '描述'],
      placeholder: ['请输入', '请选择', '搜索'],
      validation: ['必填', '格式', '长度'],
    },
  },
};
