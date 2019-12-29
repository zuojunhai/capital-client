<template>
    <div>
        <div class="block top">
            <el-date-picker v-model="value" type="daterange" align="right" unlink-panels range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
            <el-button type='primary' @click='getLineByData'>确定</el-button>
            <span class="title">选择日期范围查看折线图</span>
        </div>
        <div id="myChart" :style="{width: '1000px', height: '500px'}"></div>
    </div>
</template>



<script>
    export default {
        name: 'brokenline',
        data() {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value: '',
                incomeArr: [],//每一项是每一天的收入
                expendArr: [],
                dateArr: []//每一项是日期
            }
        },
        methods: {
            getLineByData() {
                if (this.value === '') {
                    this.$message({
                        message: '请选择日期范围',
                        type: 'warning'
                    })
                    return
                }
                var preDate = this.value[0].toLocaleDateString().split('/').join('-')
                var nextDate = this.value[1].toLocaleDateString().split('/').join('-')
                //xxxx-xx-xx
                this.$axios.get(`/api/profiles/dates/${preDate}/${nextDate}`)
                    .then(res => {
                        if (res.data.length==0) {
                            this.$message({
                                message: '该日期范围内没有数据哟',
                                type: 'warning'
                            })
                            return
                        }
                        res.data.forEach((item, index) => {
                            var stringDate = new Date(item.date).toLocaleDateString()
                            //array.indexOf   此方法判断数组中是否存在某个值，如果存在返回数组元素的下标，否则返回-1
                            var number = this.dateArr.indexOf(stringDate)
                            if (number == -1) {
                                this.dateArr.push(new Date(item.date).toLocaleDateString())
                            }
                        })
                        //this.dateArr.length得到日期数组的个数，把收入和支出数组的个数也设置成相同，并且初始化为0
                        //否则后面无法操作数组的元素
                        this.incomeArr = Array(this.dateArr.length).fill(0)
                        this.expendArr = Array(this.dateArr.length).fill(0)
                        res.data.forEach((item, index) => {
                            var stringDate1 = new Date(item.date).toLocaleDateString()
                            this.dateArr.forEach((item1, index1) => {
                                if (item1 == stringDate1) {
                                    this.incomeArr[index1] += item.income
                                    this.expendArr[index1] += item.expend
                                }
                            })
                        })
                        this.drawLine()
                        this.dateArr = []
                        this.incomeArr = []
                        this.expendArr = []
                    })
            },
            drawLine() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption({
                    legend: {
                        data: ['收入', '支出']
                    },
                    xAxis: {
                        type: 'category',
                        data: this.dateArr
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '收入',
                            data: this.incomeArr,
                            type: 'line'
                        },
                        {
                            name: '支出',
                            data: this.expendArr,
                            type: 'line'
                        }
                    ]
                })
            },
        }
    }
</script>




<style scoped>
    .top {
        margin-top: 30px;
        margin-left: 250px;
    }

    .title {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
        font-weight: 700;
        margin-left: 30px;
        color: cornflowerblue;
    }

    #myChart {
        margin-top: 10px;
        margin-left: 90px;
    }
</style>