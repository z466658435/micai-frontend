import React, { useEffect, useState } from 'react'
import Swiper from 'swiper'
import '../static/plugins/swiper-bundle.min.css'
import first_bgpng from '../static/home_medium/first_bg.png'
import first_bgmp4 from '../static/home_medium/first_bg.mp4'
import carousel1 from '../static/img/carousel01.png'
import carousel2 from '../static/img/carousel02.png'
import carousel3 from '../static/img/carousel03.png'
import carousel4 from '../static/img/carousel04.png'
import carousel5 from '../static/img/carousel05.png'
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
            <span className="p1">南京工业大学</span>
            <span className="p11">
              迷彩协会
              {/* <img src={micaiLogo} /> */}
            </span>
            <p className="p2">NJTECH CAMOUFLAGE ASSOCIATION</p>
            <p className="p3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
              ducimus velit sunt! Deleniti adipisci placeat quaerat excepturi
              quibusdam quas, aut qui eum vitae eligendi magni nobis? Quia
              repellendus laborum laudantium.
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
              <h1>关于我们</h1>
              <h4>
                迷彩协会是由大学里的退伍大学生自发组成的组织，旨在维护和传承军队文化，促进大学生的全面发展。
              </h4>
            </div>
          </div>

          <div className="carousel">
            <div id="carousel">
              <div className="swiper swiper-3d">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <img src={carousel1} />
                    <p>北京冬奥会迎来倒计时一个月</p>
                  </div>
                  <div className="swiper-slide">
                    <img src={carousel2} />
                    <p>北京冬奥会迎来倒计时一个月</p>
                  </div>
                  <div className="swiper-slide">
                    <img src={carousel3} />
                    <p>北京冬奥会迎来倒计时一个月</p>
                  </div>
                  <div className="swiper-slide">
                    <img src={carousel4} />
                    <p>北京冬奥会迎来倒计时一个月</p>
                  </div>
                  <div className="swiper-slide">
                    <img src={carousel5} />
                    <p>北京冬奥会迎来倒计时一个月</p>
                  </div>
                  <div className="swiper-slide">
                    <img src={carousel5} />
                    <p>北京冬奥会迎来倒计时一个月</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="third">
          <div className="third_title">
            <h1>协会活动</h1>
          </div>
          <div className="posts">
            <div className="post post1">
              <div className="postimg">
                <img src={carousel1} alt="" />
              </div>
              <div className="content">
                <div className="h2">我是标题</div>
                <div className="p">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
                  aspernatur consequatur error exercitationem, nam explicabo
                  nihil aperiam culpa. Asperiores, amet aut repellendus nobis
                  soluta aliquid officia. Perferendis doloremque nobis ratione.
                </div>
              </div>
            </div>
            <div className="post post2">
              <div className="postimg">
                <img src={carousel1} alt="" />
              </div>
              <div className="content">
                <div className="h2">我是标题</div>
                <div className="p">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
                  aspernatur consequatur error exercitationem, nam explicabo
                  nihil aperiam culpa. Asperiores, amet aut repellendus nobis
                  soluta aliquid officia. Perferendis doloremque nobis ratione.
                </div>
              </div>
            </div>
            <div className="post post3">
              <div className="postimg">
                <img src={carousel1} alt="" />
              </div>
              <div className="content">
                <div className="h2">我是标题</div>
                <div className="p">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
                  aspernatur consequatur error exercitationem, nam explicabo
                  nihil aperiam culpa. Asperiores, amet aut repellendus nobis
                  soluta aliquid officia. Perferendis doloremque nobis ratione.
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
