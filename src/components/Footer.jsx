import { React, useContext, useEffect, useState } from 'react'
// import Logo from"../img/logo.png"
import micaiLogo from '../static/img/micai.ico'
import qqLogo from '../static/img/footer/qqlogo.png'
import githubLogo from '../static/img/footer/githublogo.png'
import { Col, Divider, Row } from 'antd'
import { WebSocketContext } from '../context/webSocketContext'
const Footer = () => {
  const { clientCount } = useContext(WebSocketContext)
  const [clientCounts, setClientCounts] = useState(0)
  useEffect(() => {
    setClientCounts(clientCount) //网站访问 客户端数量
  }, [])
  return (
    <div className="footerbox">
      <div className="footer_first"></div>
      <div className="footertitle">
        <div className="title01">
          <img src={micaiLogo} />
          <h2>NJTECH CAMOUFLAGE ASSOCIATION</h2>
        </div>
        <div className="title02">
          <img src={githubLogo} />
          <img src={qqLogo} />
        </div>
      </div>
      <hr className="footerhr" />
      <div className="footersec">
        <Row gutter={[16, 24]}>
          <Col className="gutter-row" span={6}>
            <div className="footeritem Frameworks">
              <h2>Frameworks</h2>
              <hr />
              <a href="https://react.dev/">React.js</a>
              <a href="https://expressjs.com/">Express.js</a>
              <a href="https://www.sass.hk/">Sass</a>
              <a href="https://echarts.apache.org/zh/index.html">Echarts</a>
              <a href="https://ant.design/index-cn">Ant Design</a>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="footeritem Websites">
              <h2>Websites</h2>
              <hr />
              <a href="https://www.gfbzb.gov.cn/">全国征兵网</a>
              <a href="https://www.njtech.edu.cn/">南京工业大学官方网站</a>
              <a href="https://wzb.njtech.edu.cn/">南京工业大学国防教育网</a>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="footeritem Friendlylink">
              <h2>Friendly link</h2>
              <hr />
              <a href="https://acm.online.njtech.edu.cn/">Njtech OJ</a>
              <a href="https://online.njtech.edu.cn/#/">Njtech Online</a>
              <a href="https://www.vistalab.top">Njtech Vistalab</a>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <h2>Developing</h2>
            <hr />
          </Col>
        </Row>
      </div>
      <div className="legalbox">
        <div className="legal">
          <p>CopyrightXXXXXX</p>
          <p className='clientcounts'>本站目前访问人数：{clientCounts} 人</p>
          </div>
      </div>
      {/* <span>
        Made with love and <b>React.js</b>
      </span> */}
    </div>
  )
}

export default Footer
