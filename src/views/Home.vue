<template>
    <div class="home">
        <div class="container">
            <h1 class="title">中小型公司资金流水管理系统</h1>
            <p class="lead">欢迎使用本系统</p>
        </div>
    </div>
</template>

<script>
export default{
    data () {
        return {
            
        }
    },
    computed: {
            user() {
                return this.$store.getters.user;
            }
        },
}
</script>

<style scoped>
    .home {
        width: 100%;
        height: 100%;
        background: url(../assets/showcase.png) no-repeat;
        background-size: 100% 100%;
    }
    .container {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-top: 100px;
        background-color: rgba(0, 0, 0, 0.7);
        text-align: center;
        color: white;
    }
    .title {
        font-size: 30px;
    }
    .lead {
        margin-top: 50px;
        font-size: 22px;
    }
</style>