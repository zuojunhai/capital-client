<template>
    <div>
        <div class="employees" v-if="user.identity=='employee'">您没有权限对此页面进行操作</div>
        <div v-if="user.identity == 'manager'">
            <h1>添加备忘录</h1>
            <div class="container">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="填写你的名字"></el-input>
                    </el-form-item>
                    <el-form-item label="备忘日期" required>
                        <el-col :span="11">
                            <el-form-item prop="date">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date"
                                    style="width: 100%;">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="备忘内容" prop="content">
                        <el-input type="textarea" v-model="ruleForm.content" placeholder="填写备忘录的内容"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'addNotes',
        data() {
            return {
                ruleForm: {
                    name: '',
                    date: '',
                    content: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入您的名字', trigger: 'blur' },
                        { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    date: [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    content: [
                        { required: true, message: '请填写备忘录内容', trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            user() {
                return this.$store.getters.user;
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/api/notes/add', this.ruleForm)
                            .then(res => {
                                this.$message({
                                    message: "添加成功！",
                                    type: "success"
                                })
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>
    .container {
        width: 500px;
        margin: 50px auto;
    }

    h1 {
        width: 100%;
        text-align: center;
        margin-top: 80px;
        font-size: 20px;
        font-weight: 700;
    }
    .employees{
        font-size: 40px;
        font-weight: 700;
        width: 100%;
        text-align: center;
        margin-top: 200px;
    }
</style>