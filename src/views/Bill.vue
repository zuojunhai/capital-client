<template>
    <div>
        <div class="container">
            <div class="block">
                <span class="demonstration">请选择一个月份:</span>
                <el-date-picker v-model="value" type="month" placeholder="选择月">
                </el-date-picker>
                <el-button type='primary' @click='getData'>确定</el-button>
            </div>
        </div>
        <div class="content">
            <template>
                <el-table :data="tableData1" border style="width: 50%" class="left">
                    <el-table-column prop="type1" label="收入类型" width="180">
                    </el-table-column>
                    <el-table-column prop="income" label="收入金额" width="180">
                    </el-table-column>
                </el-table>
                <el-table :data="tableData2" border style="width: 50%" class="right">
                    <el-table-column prop="type2" label="支出类型" width="180">
                    </el-table-column>
                    <el-table-column prop="expend" label="支出金额" width="180">
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <div class="money">
            <span class="income" v-model="incomeTotal">本月份的总收入：{{incomeTotal}}元</span>
            <span class="expend" v-model='expendTotal'>本月份的总支出：{{expendTotal}}元</span>
        </div>
    </div>
</template>



<script>
    export default {
        name: 'bill',
        data() {
            return {
                value: '',
                tableData1: [{
                    type1: '',
                    income: 0
                }],
                tableData2: [
                    {
                        type2: '',
                        expend: 0
                    }
                ],
                incomeTotal: 0,
                expendTotal: 0
            }
        },
        methods: {
            getData() {
                var date1 = this.value.toLocaleDateString()//xxxx/xx/xx
                var date2 = date1.split('/')
                date2[2] = '1'
                date2 = date2.join('-')
                var date3 = date1.split('/')
                date3[2] = '31'
                date3 = date3.join('-')
                this.tableData1 = [{
                    type1: '',
                    income: 0
                }]
                this.tableData2 = [
                    {
                        type2: '',
                        expend: 0
                    }
                ]
                this.incomeTotal=0
                this.expendTotal=0
                this.$axios.get(`/api/profiles/dates/${date2}/${date3}`)
                    .then(res => {
                        if (res.data.length == 0) {
                            this.$message({
                                message: '该月份没有数据',
                                type: 'warning'
                            })
                            return
                        }
                        res.data.forEach((item, index) => {
                            var obj1 = {
                                type1: '',
                                income: 0
                            }
                            var obj2 = {
                                type2: '',
                                expend: 0
                            }
                            obj1.type1 = item.type1
                            obj1.income = item.income
                            obj2.type2 = item.type2
                            obj2.expend = item.expend
                            for (var i = 0; i < this.tableData1.length; i++) {
                                if (!item.type1) { break }
                                if (item.type1 == this.tableData1[i].type1) {
                                    this.tableData1[i].income += item.income
                                    break
                                }
                                if (i == this.tableData1.length - 1) {
                                    this.tableData1.push(obj1)
                                }
                            }
                            for (var i = 0; i < this.tableData2.length; i++) {
                                if (!item.type2) { break }
                                if (item.type2 == this.tableData2[i].type2) {
                                    this.tableData2[i].expend += item.expend
                                    break
                                }
                                if (i == this.tableData2.length - 1) {
                                    this.tableData2.push(obj2)
                                }
                            }

                        })
                        this.tableData1.shift()
                        this.tableData2.shift()
                        this.tableData1.forEach((item,index)=>{
                            this.incomeTotal+=item.income
                        })
                        this.tableData2.forEach((item,index)=>{
                            this.expendTotal+=item.expend
                        })
                    })
            }
        }
    }
</script>



<style scoped>
    .container {
        margin-top: 20px;
        margin-left: 300px;
    }

    .container span {
        font-weight: 700;
        font-size: 20px;
        margin-right: 15px;
    }
    .left {
        float: left;
    }

    .right {
        float: right;
    }
    .money{
        width: 100%;
        font-size: 18px;
        font-weight: 700;
    }
    .income{
        width: 50%;
        display: inline-block;
    }
    .expend{
        width: 50%;
        display: inline-block;
    }
</style>