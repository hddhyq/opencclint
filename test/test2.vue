<template>
    <section class="community" v-if="community">
    <!-- 測試 -->
        <div class="community-title">實價登錄</div>
        <div class="community-title">宝价登錄</div>
    </section>
</template>

<script>
    /* simsimplified ignore */
    export default {
        data () {
            return {
                priceText: '來源為內政部實價登錄，此為該社區最近兩筆成交記錄，已標記出特殊交易或含車位交易。', // 實價登錄提示信息
                referText: '根據內政部實價計算出的社區成交價（近1年）' // 參考信息提示信息
            }
        },

        methods: {
            goCommunityDetail () {
                this.$router.push({
                    path: `from=中古屋详情社區詳情，需要存儲中古屋物件id，社區詳情頁用於請求`
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
.community
    background-color #fff
    padding 30px 20px
    cursor pointer

    &-title
        content '湾'
        font-size 20px
        font-weight bold
        color #333
        line-height 1
        margin-bottom .4rem

    &-content
        padding 20px 15px
        box-shadow 0 0 10px 0px rgba(0,0,0,0.12)

        &-info
            display flex
            justify-content space-between
            margin-bottom 20px
            position relative
            &-lf
                color #222
                font-size 12px
                line-height 1
                h3
                    font-weight bold
                    font-size 16px
                    margin-bottom 10px
            &-btn
                display block
                width 62px
                height 28px
                border 1px solid #FF8000
                color #FF8000
                border-radius 2px
                font-size 14px
            .share-tip
                width max-content
                position absolute
                top 37px
                right -5px
                color #fff
                background rgba(48,49,51,.7)
                line-height: 1
                padding 10px
                border-radius 5px
                font-size 12px
                &:before
                    content ""
                    display block
                    position absolute
                    top -14px
                    right 28px
                    border 7px solid transparent
                    border-bottom-color rgba(48,49,51,.7)

        &-num
            display flex
            margin-bottom 14px
            li
                margin-right 40px
                line-height 1
                color #999
                font-size 12px
                div
                    color #222
                    font-size 16px
                    font-weight bold
                    margin-bottom 6px
                &:first-child
                    div
                        color #FF4400
                &:last-child
                    margin-right 0

        &-line
            display flex
            justify-content space-between
            align-items center
            #community-line
                width 250px
                height 50px
                margin-left -2px
                overflow hidden
            &-btn
                font-size 14px
                color #222
                span
                    margin-right 5px
                i
                    font-size 15px
                span, i
                    vertical-align middle

    &-price
        .header
            display flex
            justify-content space-between
            font-size .32rem
            padding-left .2rem
            margin-top 20px
            margin-bottom 16px
            .title
                color #333
                display flex
                align-items center
                i.question
                    display inline-block
                    vertical-align text-bottom
                    margin-left 4px
                    width 14px
                    height 14px
                    background url('../images/question.png') center no-repeat
                    background-size 100%

        .history
            position relative
            padding-bottom 10px
            padding-left .36rem
            border-left 1px solid #f2f6fa

            &::before
                position absolute
                top .08rem
                left -.06rem
                content ''
                width .1rem
                height .1rem
                background-color #9fb4c8
                border-radius 50%

            &:last-of-type
                padding-bottom 0

            &-item
                display flex
                justify-content space-between
                line-height 1
                margin-bottom 8px
                color #999
                font-size 12px
                &:first-child
                    margin-bottom 12px

                &-price
                    color #FF4400
                    font-size 16px
                    span
                        font-size .2rem
                        margin-left 2px

                &-info
                    font-size 14px
                    color #222

        .more
            margin-top 10px
            a
                display inline-block
                border-radius 5px
                font-size 0.28rem
                text-align center
                width 6.9rem
                height 0.88rem
                line-height 0.88rem
                background-color #f2f6fa
                border-radius 2px
                color #2478d2

// 彈窗
.van-dialog
    width 6.6rem
    &__header
        font-size .42rem
        font-weight bold
        color #333
    &__content
        font-size .28rem
        color #999
</style>
