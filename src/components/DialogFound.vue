<template>
    <div class="logFound">
        <el-dialog :title="dialog.title" :visible.sync="dialog.show" :close-on-click-modal='false' :close-on-press-escape='false' :modal-append-to-body="false">
            <div class="form">
                <el-form ref="form" :model="form" :rules="form_rules" label-width="120px" style="margin:10px;width:auto;">
                    <el-form-item label="收支类型:" >
                        <el-select v-model="form.type1" placeholder="收入类型">
                            <el-option v-for="(formtype, index) in format_type_list1" :key="index" :label="formtype" :value="formtype"></el-option>
                        </el-select>
                        <el-select v-model="form.type2" placeholder="支出类型">
                            <el-option v-for="(formtype, index) in format_type_list2" :key="index" :label="formtype" :value="formtype"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop='describe' label="收支描述:">
                        <el-input type="describe" v-model="form.describe"></el-input>
                    </el-form-item>
                    <el-form-item prop='income'  label="收入:">
                        <el-input type="income" v-model="form.income"></el-input>
                    </el-form-item>
                    <el-form-item prop='expend' label="支出:">
                        <el-input type="expend" v-model="form.expend"></el-input>
                    </el-form-item>
                    <el-form-item prop='cash' label="盈损情况:">
                        <el-input type="cash" v-model="form.cash" :disabled="true"></el-input>
                        <el-button type="primary" size="mini" round @click="updateCash()">点击自动计算</el-button>
                    </el-form-item>
                    <el-form-item label="备注:">
                        <el-input type="textarea" v-model="form.remark"></el-input>
                    </el-form-item>
                    <el-form-item  class="text_right">
                        <el-button @click="dialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name:'logFound',
        props:{//父组件通过属性绑定的形式向子组件传值，子组件要用pros里注册一下才能用
            dialog: Object,
            form: Object
        },
        data(){
            return {
                format_type_list1: [
                    "主营业务收入",
                    "其他业务收入",
                    "营业外收入",
                    "投资收益",
                    "利息收入"
                ],
                format_type_list2: [
                    "主营业务成本",
                    "主营业务税金及附加",
                    "其他业务支出",
                    "营业费用",
                    "管理费用"
                ],
                form_rules: {//表单验证规则，要在form表单里用:rules="form_rules"绑定一下。
                             //之后表单的每一项用prop属性直接等于规则的每一项就ok了
                    describe: [
                        { required: true, message: "收支描述不能为空！", trigger: "blur" }
                    ],
                    income: [
                        { required: true, message: "收入不能为空！", trigger: "blur" }
                    ],
                    expend: [
                        { required: true, message: "支出不能为空！", trigger: "blur" }
                    ]
                }
            }
        },
        methods:{
            onSubmit(form){
                this.$refs[form].validate(valid=>{
                    if(valid){
                        //表单数据验证完成之后，提交数据;
                        const url = this.dialog.option === "add" ? "add" : `edit${this.form.id}`
                        this.$axios.post(`/api/profiles/${url}`, this.form)
                            .then(res => {
                            // 操作成功
                            this.$message({
                                message: "保存成功！",
                                type: "success"
                            });
                            this.dialog.show = false
                            //子项调用父项的方法，第一个参数是调用父项的方法名，后面的参数是父项方法所需的参数(子组件向父组件传值)
                            this.$emit("update")
                        })
                    }
                })
            },
            updateCash(){
                console.log(this.form.income-this.form.expend)
                this.form.cash=this.form.income-this.form.expend
            }
        }
    }
</script>

<style scoped>
</style>