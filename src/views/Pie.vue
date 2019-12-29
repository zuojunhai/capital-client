<template>
    <div>
        <div class="top">
            <el-date-picker v-model="value" type="date" placeholder="选择日期">
            </el-date-picker>
            <el-button type='primary' @click='getPieByDate'>确定</el-button>
            <span class="title">选择日期查看饼图</span>
        </div>
        <div class="left">
            <div id="myChart" :style="{width: '400px', height: '400px'}"></div>
        </div>
        <div class="right">
            <div id="myChart_income" :style="{width: '450px', height: '280px'}"></div>
            <div id="myChart_expend" :style="{width: '450px', height: '280px'}"></div>
        </div>   
    </div>
</template>



<script>
    export default {
        name: 'pie',
        data() {
            return {
                value: '',
                stringDate: '',//时间字符串，发请求要传入的值xxxx-xx-xx
                arrDatas: [],//数据数组，发请求后拿到的数据
                incomeTotal: 0,//总收入
                expendTotal: 0,//总支出
                incomeData:[{
                    name:'',
                    value:''
                }],//收入数组对象，每一项{name:'',value:''}
                expendData:[{
                    name:'',
                    value:''
                }],//支出数组对象，每一项{expend_type:'',expend_money:''}
            }
        },
        methods: {
            getPieByDate() {
                if (this.value === '') {
                    this.$message({
                        message: '请选择日期',
                        type: 'warning'
                    })
                    return
                }
                //将拿到的日期转换成xxxx/xx/xx格式，再用/分隔字符转得到一个数组，再将数据以-分隔得到时间字符串
                var dateObj = new Date(this.value)
                var date = dateObj.toLocaleDateString()
                var arrDate = date.split('/')
                this.stringDate = arrDate.join('-')
                //发请求拿数据
                this.$axios.get(`/api/profiles/date${this.stringDate}`)
                    .then(res => {
                        //把数据存到arrDatas中
                        this.arrDatas=res.data
                        //先重置总收入和总支出为0，否则上次保存的数据会有影响
                        this.incomeTotal=0
                        this.expendTotal=0
                        //循环遍历数组数据，得到总收入和总支出
                        this.arrDatas.forEach((item,index)=>{
                            this.incomeTotal+=item.income
                            this.expendTotal+=item.expend
                        })
                        // console.log(this.incomeTotal,this.expendTotal)
                        //收入,先清空一下数组，否则上一次请求的结果会有影响
                        this.incomeData=[{name:'',value:''}]
                        this.arrDatas.forEach((item,index)=>{//循环遍历数组数据
                            //先把每一项的type和income保存到一个对象中
                            var obj={}
                            obj.name=item.type1
                            obj.value=item.income
                            //循环遍历收入数组，如果数组中有了type类型，就只加income，否则就把对象导入
                            for(var i=0;i<this.incomeData.length;i++){
                                //先判断有没有这个属性，因为收入可能为空，没有属性就结束循环
                                if(!item.type1){break}
                                if(item.type1==this.incomeData[i].name){
                                    this.incomeData[i].value+=item.income
                                    break
                                }
                                if(i==this.incomeData.length-1){
                                    this.incomeData.push(obj)
                                }

                            }
                        })
                        //支出
                        this.expendData=[{name:'',value:''}]
                        this.arrDatas.forEach((item,index)=>{//循环遍历数组数据
                            //先把每一项的type和income保存到一个对象中
                            var obj={}
                            obj.name=item.type2
                            obj.value=item.expend
                            //循环遍历收入数组，如果数组中有了tyle类型，就只加income，否则就把对象导入
                            for(var i=0;i<this.expendData.length;i++){
                                if(!item.type2){break}
                                if(item.type2==this.expendData[i].name){
                                    this.expendData[i].value+=item.expend
                                    break
                                }
                                if(i==this.expendData.length-1){
                                    this.expendData.push(obj)
                                }

                            }
                        })
                        //删除数组的第一项（第一项内容是空的）
                        this.incomeData.shift()
                        this.expendData.shift()
                        if(!this.incomeTotal&&!this.expendTotal){
                            this.$message({
                                message:'这一天没有数据哟',
                                type: 'warning'
                            })
                            return
                        }
                        //调用收支饼图方法
                        this.drawLine()
                        this.drawLine_income()
                        this.drawLine_expend()
                    })

            },
            drawLine() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '收入支出比例图',
                        subtext: '---',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['收入', '支出']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                { value: this.incomeTotal, name: '收入' },
                                { value: this.expendTotal, name: '支出' },
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            },
            drawLine_income() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart_income'))
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '收入比例图',
                        subtext: '---',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: this.incomeData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            },
            drawLine_expend() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart_expend'))
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '支出比例图',
                        subtext: '---',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: this.expendData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            },

        }
    }
</script>




<style scoped>
    .top {
        margin-left: 250px;
        margin-top: 30px;
    }
    .left{
        float: left;
        margin-top: 50px;
        margin-left: 100px;
        padding-right: 50px;
    }
    .right{
        float: right;
        margin-right: 100px;
        margin-top: -70px;
    }
    #myChart_expend{
        margin-top: 30px;
    }
    .title{
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
        font-weight: 700;
        margin-left: 30px;
        color: cornflowerblue;
    }
</style>