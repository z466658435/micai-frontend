import React, { useEffect, useState } from 'react'
import Swiper from 'swiper'
import '../static/plugins/swiper-bundle.min.css'
import first_bgpng from '../static/home_medium/first_bg.png'
import first_bgmp4 from '../static/home_medium/first_bg.mp4'
import xjtjunxun from '../static/img/carousel/xjtjunxun.png'
import junshitiyanri from '../static/img/carousel/junshitiyanri.jpg'
import chiqiang from '../static/img/carousel/chiqiang.jpg'
import help from '../static/img/carousel/help.jpg'
import junxunpeixun from '../static/img/carousel/junxunpeixun.png'
import xueshengjunxun from '../static/img/carousel/xueshengjunxun.png'
import peace from '../static/img/carousel/peace.png'
import tuanjian from '../static/img/carousel/tuanjian.jpg'
import tubu from '../static/img/carousel/tubu.jpg'
import woqiang from '../static/img/carousel/woqiang.jpg'
import biaozhang from '../static/img/carousel/biaozhang.jpg'
import bangongshi from '../static/img/carousel/bangongshi.jpg'
import {
  LoadingOutlined,
  SmileOutlined,
  AreaChartOutlined,
  HomeOutlined,
  HighlightOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { ConfigProvider, Steps } from 'antd'
import * as echarts from 'echarts'
import axios from 'axios'
import Footer from '../components/Footer'
// import micaiLogo from '../static/img/micai.ico'
// import njtechLogo from '../static/img/njtech.png'

const Home = () => {
  const [oridata, setOridata] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const slideW = 20
    const radius = (slideW * 0.5) / Math.sin(Math.PI / 16)

    new Swiper('#carousel .swiper', {
      watchSlidesProgress: true,
      slidesPerView: 'auto',
      centeredSlides: false,
      loop: false,
      loopedSlides: 6,
      grabCursor: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
      },
      on: {
        progress: function (swiper, progress) {
          for (let i = 0; i < this.slides.length; i++) {
            const slide = this.slides[i]
            const slideProgress = slide.progress
            const translateX =
              (slideProgress + 1.5) *
                (slideW / 3 -
                  (Math.cos((slideProgress + 1.5) * 0.125 * Math.PI) *
                    slideW *
                    1.1) /
                    3) +
              'vw'
            const rotateY = (slideProgress + 1.5) * 22.5
            const translateZ =
              radius -
              Math.cos((slideProgress + 1.5) * 0.125 * Math.PI) * radius -
              10 +
              'vw'
            slide.style.transform =
              'translateX(' +
              translateX +
              ') translateZ(' +
              translateZ +
              ') rotateY(' +
              rotateY +
              'deg)'
          }
        },
        // setTransition: function (swiper, transition) {
        //   for (let i = 0; i < swiper.slides.length; i++) {
        //     const slide = swiper.slides[i]
        //     slide.style.transition = transition
        //   }
        // },
      },
    })
  }, [])

  //echarts拿数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/init_data/home`)
        setOridata(res.data)
        setIsLoading(false) // 数据加载完成后设置 isLoading 为 false
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
    console.log(1221111211)
    console.log(oridata)
  }, [])

  //echarts
  useEffect(() => {
    if (!isLoading) {
      //e1
      const collegeCounts = {}
      //e2
      const serviecesCounts = {}
      //e3
      const dateCounts = {}

      oridata.forEach((item) => {
        //e1
        const collegedata = item.college
        const gender = item.gender
        if (!collegeCounts[collegedata]) {
          collegeCounts[collegedata] = {}
          collegeCounts[collegedata]['总'] = 0
          collegeCounts[collegedata]['男'] = 0
          collegeCounts[collegedata]['女'] = 0
        }
        collegeCounts[collegedata]['总']++
        collegeCounts[collegedata][gender] =
          (collegeCounts[collegedata][gender] || 0) + 1
        //e2
        const servicesdata = item.services
        if (!serviecesCounts[servicesdata]) {
          serviecesCounts[servicesdata] = {}
          serviecesCounts[servicesdata]['总'] = 0
          serviecesCounts[servicesdata]['男'] = 0
          serviecesCounts[servicesdata]['女'] = 0
        }
        serviecesCounts[servicesdata]['总']++
        serviecesCounts[servicesdata][gender] =
          (serviecesCounts[servicesdata][gender] || 0) + 1
        // console.log(serviecesCounts)
        //e3
        const date = item.date
        dateCounts[date] = (dateCounts[date] || 0) + 1
      })

      //折线图
      const collegeNames = Object.keys(collegeCounts)
      const totalArray0 = []
      const totalArray1 = []
      const totalArray2 = []
      for (const college in collegeCounts) {
        totalArray0.push(collegeCounts[college]['总'])
        totalArray1.push(collegeCounts[college]['男'])
        totalArray2.push(collegeCounts[college]['女'])
      }
      const myChart1 = echarts.init(document.getElementById('e1'), 'dark')
      myChart1.setOption({
        backgroundColor: '#323335',
        title: {
          text: '专业分布',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['总人数', '男', '女'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: collegeNames,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '总人数',
            type: 'line',
            data: totalArray0,
          },
          {
            name: '男',
            type: 'line',
            data: totalArray1,
          },
          {
            name: '女',
            type: 'line',
            data: totalArray2,
          },
        ],
      })

      //柱状图
      const servicesNames = Object.keys(serviecesCounts)
      const servicesArray0 = []
      const servicesArray1 = []
      const servicesArray2 = []
      for (const services in serviecesCounts) {
        servicesArray0.push(serviecesCounts[services]['总'])
        servicesArray1.push(serviecesCounts[services]['男'])
        servicesArray2.push(serviecesCounts[services]['女'])
      }

      const myChart2 = echarts.init(document.getElementById('e21'), 'dark')
      myChart2.setOption({
        backgroundColor: '#323335',
        title: {
          text: '军种分布',
        },
        tooltip: {},
        xAxis: {
          data: servicesNames,
        },
        yAxis: {},
        series: [
          {
            name: '总人数',
            type: 'bar',
            data: servicesArray0,
          },
          {
            name: '男',
            type: 'bar',
            data: servicesArray1,
          },
          {
            name: '女',
            type: 'bar',
            data: servicesArray2,
          },
        ],
      })
      //饼图
      const c3data = Object.entries(dateCounts).map(([name, value]) => ({
        name,
        value,
      }))
      const myChart3 = echarts.init(document.getElementById('e22'), 'dark')
      myChart3.setOption({
        title: {
          text: '年龄分布',
        },
        backgroundColor: '#323335',
        tooltip: {
          trigger: 'item',
        },
        legend: {
          bottom: '10%',
          left: 'center',
        },
        series: [
          {
            bottom: '20%',
            name: '出生年份',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: c3data,
          },
        ],
      })
    }
  }, [isLoading])

  return (
    <>
      <div className="home">
        <div className="content">
          {/* <div className="micaiLogo">
            <img src={micaiLogo} alt="" />
          </div> */}
          <div className="text">
            <span className="p1">南工</span>
            <span className="p11">
              迷彩
              {/* <img src={micaiLogo} /> */}
            </span>
            <p className="p2">NJTECH CAMOUFLAGE ASSOCIATION</p>
            <p className="p3">
              
              南工迷彩协会，是由校武装部统一领导的退役大学生士兵组织。协会旨在传承军事文化，弘扬爱国主义精神。
            </p>
            <a href="https://www.gfbzb.gov.cn/">
              <div className="button">
                <span>全国征兵网</span>
              </div>
            </a>
          </div>
          <div className="video">
            <video
              className="videoBG"
              src={first_bgmp4}
              poster={first_bgpng}
              autoPlay
              loop
              muted></video>
          </div>
        </div>
        <div className="home_first"></div>
        <div className="second">
          <div className="stepbox">
            <div className="step">
              <ConfigProvider
                theme={{
                  token: {
                    // Seed Token，影响范围大
                    colorPrimary: 'rgb(112, 167, 46)',
                    borderRadius: 2,

                    // 派生变量，影响范围小
                    colorBgContainer: '#749946',
                  },
                }}>
                <Steps
                  size="small"
                  current={1}
                  items={[
                    {
                      title: 'Framework',
                      description: '网站主体搭建完毕',
                      icon: <HomeOutlined />,
                    },
                    {
                      title: 'Profile',
                      status: 'finish',
                      description: '个人资料上线',
                      icon: <SmileOutlined />,
                    },
                    {
                      title: 'Backend',
                      status: 'finish',
                      description: '用户后台上线',
                      icon: <UserOutlined />,
                    },
                    {
                      title: 'Article',
                      status: 'finish',
                      description: '文章板块上线',
                      icon: <HighlightOutlined />,
                    },
                    {
                      title: 'ChatGPT',
                      status: 'process',
                      icon: <LoadingOutlined />,
                      description: 'AI模块建设中',
                    },
                  ]}
                />
              </ConfigProvider>
            </div>
          </div>
          <div className="seccontent">
            <div className="sectext">
              <h1>关于协会</h1>
              <h4>
              在校武装部领导下，南工迷彩协会参与各类活动，发扬退役军人的优良作风。协会成员运用在服役期间的所知所学，解决身边同学的实际困难。协会还积极投身志愿服务活动，使退役士兵在社会上继续发光发热。通过参与协会活动，退役大学生士兵的个人素质得到全面发展。协会的凝聚力不断增强，协会发展蒸蒸日上
              </h4>
            </div>
          </div>

          <div className="carousel">
            <div id="carousel">
              <div className="swiper swiper-3d">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <img src={peace} />
                    <p>12•13 国家公祭日</p>
                  </div>
                  <div className="swiper-slide">
                    <img src={junxunpeixun} />
                    <p>军训教官培训</p>
                  </div>
                  <div className="swiper-slide">
                    <img src={tuanjian} />
                    <p>协会团队建设</p>
                  </div>
                  <div className="swiper-slide">
                    <img src={junshitiyanri} />
                    <p>军事体验日</p>
                  </div>
                  <div className="swiper-slide">
                    <img src={xueshengjunxun} />
                    <p>协助学生军训</p>
                  </div>
                  <div className="swiper-slide">
                    <img src={biaozhang} />
                    <p>获奖表彰</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="third">
          <div className="third_title">
            <h1>协会任务</h1>
          </div>
          <div className="posts">
            <div className="post post1">
              <div className="postimg">
                <img src={help} alt="" />
              </div>
              <div className="content">
                <div className="h2">参与志愿服务</div>
                <div className="p">
                协会在校武装部的领导下，参与校内校外的志愿服务活动。协会成员冲锋一线，不怕苦不畏难，勇挑重担，给人们提供帮助。成员始终铭记军队优良传统，铭记退伍不褪色的铮铮誓言，在一次次的志愿服务活动中提升个人能力，实现自我价值。
                </div>
              </div>
            </div>
            <div className="post post2">
              <div className="postimg">
                <img src={xjtjunxun} alt="" />
              </div>
              <div className="content">
                <div className="h2">参与学生军训</div>
                <div className="p">
                在大学生军训期间，协会积极参与，提供帮助。协会成员通过在服役期间习得的各项知识技能，帮助军训大学生尽快度过适应期。协会通过宣扬军队政策，提高大学生参军报国的热情。协会弘扬爱国主义精神，提升大学生的家国情怀。协会在军训期间提供有力支持和帮助。
                </div>
              </div>
            </div>
            <div className="post post3">
              <div className="postimg">
                <img src={bangongshi} alt="" />
              </div>
              <div className="content">
                <div className="h2">校园驻守值班</div>
                <div className="p">
                为了给身边同学提供帮助，在校武装部领导下，学校开设有宿舍服务站和校自管会。协会成员广泛参与，成为其中的骨干力量。服务站分布于校园各地，在身边同学遇到困难时，协会成员及时前往进行解决。在校自管会中，协会成员维持应有的秩序，为自习的同学提供热心的服务。
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="echarts">
          <div className="etext">
            <h1>
              成员分布 <AreaChartOutlined />
            </h1>
          </div>
          <div className="e1box">
            <div className="e1" id="e1"></div>
          </div>
          <div className="e2box">
            <div className="e21box">
              <div className="e21" id="e21"></div>
            </div>
            <div className="e22box">
              <div className="e22" id="e22"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home
