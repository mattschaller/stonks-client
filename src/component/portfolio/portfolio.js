import React, { useContext, useState, useEffect  } from 'react';
import { authContext } from '../../contexts/AuthContext';
import { serviceContext } from '../../contexts/ServiceContext';

import { Button, Table, Form, Select } from 'antd';

const { Option } = Select;

const columnsArray = [
    {
      title: '_id',
      dataIndex: '_id',
      key: '_id'
    },
    {
      title: 'symbol',
      dataIndex: 'symbol',
      key: 'symbol'
    },
    {
      title: 'quantity',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'portfolioId',
      dataIndex: 'portfolioId',
      key: 'portfolioId'
    },
    {
      title: 'userId',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: 'action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button type="link" size="small">Sell {record.symbol}</Button>
        </>
      )
    }
  ]

const Portfolio = () => {
    const { auth } = useContext(authContext);
    const { service } = useContext(serviceContext);
    const [list, setList] = useState([]);
    const [active, setActive] = useState("");
    const userId = auth.data.user._id

    const getList = async () => {
        let portfolios = await service.send("find", "portfolios", {userId})
        if(portfolios && portfolios.data.length) {
            if(active) {
                let found = portfolios.data.find(p => p._id === active)
                if(!found) setActive(portfolios.data[0]._id)
            } else {
                setActive(portfolios.data[0]._id)
            }
        }
        setList(portfolios.data)
    }

    const loadPortfolio = id => setActive(id)
    
    const createPortfolio = async () => {
        let portfolio = await service.send("create", "portfolios", { userId: auth.data.user._id });
        getList()
        setActive(portfolio._id)
    }

    useEffect(() => {
    }, [auth]);

    useEffect(() => {
        if(!service.loading) getList()
    }, [service, active]);

    return(
        <>
            <Form layout="inline" >
            <Form.Item>
                Active Portfolio
            </Form.Item>
            <Form.Item>
                {list && list.length && (
                    <Select value={active} onChange={loadPortfolio}>
                        {list.map(portfolio => (
                            <Option key={portfolio._id} value={portfolio._id}>{portfolio._id}</Option>
                        ))}
                    </Select>
                )}
            </Form.Item>
            <Form.Item>
                <Button onClick={createPortfolio}>
                New
                </Button>
            </Form.Item>
            </Form>
            {active && <Positions userId={auth.data.user._id} refreshPositions={getList} portfolioId={active} />}
            {!list && <PortfolioCreate createPortfolio={createPortfolio} />}
        </>
    )
}

const Positions = (props) => {
    const [list, setList] = useState([]);
    const { service } = useContext(serviceContext);
    const { portfolioId, userId } = props

    const getList = async (portfolioId) => {
        let positions = await service.send("find", "positions", { portfolioId })
        setList(positions.data)
    }

    const createPosition = async () => {
        let position = await service.send("create", "positions", { userId, portfolioId, symbol: 'TSLA', type: 'stock', quantity: 23, price: 1512});
        getList(portfolioId)
    }

    const depositCash = async () => {
        let deposit = await service.send("create", "positions", { userId, portfolioId, symbol: 'USD', type: 'cash', quantity: 100000, price: 1});
        getList(portfolioId)
    }

    const deletePortfolio = async () => {
        if(portfolioId && !list.length) {
            let deletedPortfolio = await service.send("remove", "portfolios", portfolioId)
            if(deletedPortfolio){
                props.refreshPositions();
            }
        } else {
            console.log(`Cannot delete portfolio ${portfolioId} because it has ${list.length} positions attached to it.`);
        }
    }

    useEffect(() => {
        getList(portfolioId)
    }, [portfolioId, userId]);

    return(
        <>
            {list && <Table dataSource={list} columns={columnsArray} size={'small'} />}
            <Button onClick={createPosition}>Add position</Button>
            <Button onClick={depositCash}>Deposit funds</Button>
            <Button onClick={deletePortfolio}>Delete portfolio</Button>
        </>
    )

}

const PortfolioCreate = (props) => {
    return (
        <>
            <p>
            You currently have no portfolios. 
            You should create one. 
            Its worth it. 
            It'll cost 0 dollars for now. 
            It may cost more later. 
            Interested?
            </p>
            <p>
            <Button onClick={props.createPortfolio}>
                Create a new portfolio
            </Button>
            </p>
        </>
    )
}


export default Portfolio;
