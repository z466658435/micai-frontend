import React, { useEffect, useState } from 'react'
import { Button, Table, Typography } from 'antd'
import axios from 'axios'

const { Paragraph } = Typography

function Invitecode() {
  const [usednum, setUsednum] = useState(0)
  const [unusednum, setUnusednum] = useState(0)
  const [codeinfo, setCodeinfo] = useState([])
  const [refresh, setRefresh] = useState(true)

  const data = codeinfo.map((item, index) => ({
    key: index,
    code: item.code,
    state: item.state,
    activate_time:
      item.activate_time === null
        ? null
        : new Date(item.activate_time).toLocaleString('zh-CN', {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
  }))

  const columns = [
    {
      title: '邀请码',
      dataIndex: 'code',
      key: 'code',
      width: '50%',
      sorter: (a, b) => a.code.length - b.code.length,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => <Paragraph copyable>{text}</Paragraph>,
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: '25%',
      sorter: (a, b) => a.state.length - b.state.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '激活时间',
      dataIndex: 'activate_time',
      key: 'activate_time',
      width: '20%',
      width: '25%',
      sorter: (a, b) => {
        if (a.activate_time === null && b.activate_time === null) {
          return 0
        }
        if (a.activate_time === null) {
          return 1
        }
        if (b.activate_time === null) {
          return -1
        }
        return a.activate_time.length - b.activate_time.length
      },
      sortDirections: ['descend', 'ascend'],
    },
  ]
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/back/invitecode/${1}`)
        const sortedData = res.data
          .sort((a, b) => {
            if (a.state === 'unused' && b.state === 'used') {
              return -1
            } else if (a.state === 'used' && b.state === 'unused') {
              return 1
            } else {
              return 0
            }
          })
          .map((item) => {
            if (item.state === 'unused') {
              item.state = '未使用'
            } else {
              item.state = '已使用'
            }
            return item
          })
        console.log(res.data)
        console.log(sortedData)
        setCodeinfo(sortedData)
        const filteredData0 = res.data.filter((item) => item.state === 'used')
        const count0 = filteredData0.length
        setUsednum(count0)
        const filteredData1 = res.data.filter((item) => item.state === 'unused')
        const count1 = filteredData1.length
        setUnusednum(count1)
      } catch (err) {
        console.log(err)
      }
    }

    if (refresh === true) {
      fetchData()
      setRefresh(false)
    }
  }, [refresh])

  const createcode = async () => {
    try {
      const res = await axios.post(`/back/createcode`)
      setRefresh(true)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="containerinvite">
      <div className="codeheader">
        <span className="num">
          已使用{unusednum}条，未使用{usednum}条
        </span>
        <Button className="create" onClick={createcode}>
          生成邀请码
        </Button>
      </div>
      <div className="invitebox">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="table"
        />
      </div>
    </div>
  )
}

export default Invitecode
