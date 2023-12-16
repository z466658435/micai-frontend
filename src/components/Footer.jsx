import { React, useContext, useEffect, useState } from 'react'
import micaiLogo from '../static/img/micai.ico'
import qqLogo from '../static/img/footer/qqlogo.png'
import githubLogo from '../static/img/footer/githublogo.png'
import { Col, Row } from 'antd'
import { WebSocketContext } from '../context/webSocketContext'
// import Logo from"../img/logo.png"

const Footer = ({ ifHome = true }) => {
  const { clientCount } = useContext(WebSocketContext)
  const [clientCounts, setClientCounts] = useState(0)
  useEffect(() => {
    setClientCounts(clientCount) //网站访问 客户端数量
  }, [])
  return (
    <div className={`footerbox ${ifHome ? '' : 'footerbox1'}`}>
      <div className="footer_first"></div>
      <div className="footertitle">
        <div className="title01">
          <img src={micaiLogo} />
          <h2>NJTECH CAMOUFLAGE ASSOCIATION</h2>
        </div>
        <div className="title02">
          <a href="https://github.com/z466658435">
            <img src={githubLogo} />
          </a>
          <a href="tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=466658435&website=www.oicqzone.com">
            <img src={qqLogo} />
          </a>
        </div>
      </div>
      <hr className="footerhr" />
      <div className="footersec">
        <Row gutter={[16, 24]}>
          <Col className="gutter-row Frameworks" span={6}>
            <div className="footeritem ">
              <h2>Frameworks</h2>
              <hr />
              <a href="https://react.dev/">React.js</a>
              <a href="https://expressjs.com/">Express.js</a>
              <a href="https://www.sass.hk/">Sass</a>
              <a href="https://echarts.apache.org/zh/index.html">Echarts</a>
              <a href="https://ant.design/index-cn">Ant Design</a>
            </div>
          </Col>
          <Col className="gutter-row Websites" span={6}>
            <div className="footeritem ">
              <h2>Websites</h2>
              <hr />
              <a href="https://www.gfbzb.gov.cn/">全国征兵网</a>
              <a href="https://www.njtech.edu.cn/">南京工业大学官方网站</a>
              <a href="https://wzb.njtech.edu.cn/">南京工业大学国防教育网</a>
            </div>
          </Col>
          <Col className="gutter-row Friendlylink" span={6}>
            <div className="footeritem ">
              <h2>Friendly link</h2>
              <hr />
              <a href="https://acm.online.njtech.edu.cn/">Njtech OJ</a>
              <a href="https://online.njtech.edu.cn/#/">Njtech Online</a>
              <a href="https://www.vistalab.top">Njtech Vistalab</a>
            </div>
          </Col>
          <Col className="gutter-row Developing" span={6}>
            <h2>Developing</h2>
            <hr />
          </Col>
        </Row>
      </div>
      <div className="legalbox">
        <div className="legal">
          <p className="legaltext">CopyrightXXXXXXXXXXXXX</p>
          <p className="clientcounts">本站目前访问人数：{clientCounts} 人</p>
        </div>
      </div>
      {/* <span>
        Made with love and <b>React.js</b>
      </span> */}
    </div>
  )
}

export default Footer
