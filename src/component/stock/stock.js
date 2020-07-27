import React, { Component, useState, useContext, useEffect } from 'react';
import { authContext } from '../../contexts/AuthContext';
import { serviceContext } from '../../contexts/ServiceContext';

import { PageHeader, Tabs, Statistic, Descriptions, Avatar, Input, Button, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Search } = Input;

const Stock = () => {
    const { setAuthData, auth } = useContext(authContext);
    const { service } = useContext(serviceContext);
    const [result, setResult] = useState({});
    const [query, setQuery] = useState("");

    useEffect(() => {
        //console.log(auth)
    }, [auth]);

    const getResult = async data => {
        let query = await service.send("get", "stocks", data)
        setResult(query);
        setQuery(data);
        return query;
    }
    return (
        <>
              <Search
                    placeholder='Enter ticker symbol (Ex: MSFT)'
                    enterButton="Search"
                    size="large"
                    onSearch={data => getResult(data)}
                  />
              {result.description && <StockView {...result} />}
        </>
    )
}

const StockView = (props) => {
    const results = props
    return (
        <>
            <PageHeader
                className="site-page-header-responsive"
                onBack={() => window.history.back()}
                title={results.description.name}
                subTitle={results.description.ticker}
                extra={[
                <Button key="3">Operation</Button>,
                <Button key="2">Operation</Button>,
                <Button key="1" type="primary">
                    Trade
                </Button>,
                ]}
                footer={
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Summary" key="1">
                    <Descriptions size="small" column={2}>
                        <Descriptions.Item label="country">{results.description.country}</Descriptions.Item>
                        <Descriptions.Item label="currency">{results.description.currency}</Descriptions.Item>
                        <Descriptions.Item label="exchange">{results.description.exchange}</Descriptions.Item>
                        <Descriptions.Item label="finnhubIndustry">{results.description.finnhubIndustry}</Descriptions.Item>
                        <Descriptions.Item label="ipo">{results.description.ipo}</Descriptions.Item>
                        <Descriptions.Item label="marketCapitalization">{results.description.marketCapitalization}</Descriptions.Item>
                        <Descriptions.Item label="shareOutstanding">{results.description.shareOutstanding}</Descriptions.Item>
                        <Descriptions.Item label="weburl">{results.description.weburl}</Descriptions.Item>
                    </Descriptions>
                    </TabPane>
                    <TabPane tab="Details" key="2">
                    <Descriptions size="small" column={2}>
                        <Descriptions.Item label="grossMargin5Y">{results.financials.metric.grossMargin5Y}</Descriptions.Item>
                        <Descriptions.Item label="grossMarginAnnual">{results.financials.metric.grossMarginAnnual}</Descriptions.Item>
                        <Descriptions.Item label="grossMarginTTM">{results.financials.metric.grossMarginTTM}</Descriptions.Item>
                        <Descriptions.Item label="netProfitMargin5Y">{results.financials.metric.netProfitMargin5Y}</Descriptions.Item>
                        <Descriptions.Item label="netProfitMarginAnnual">{results.financials.metric.netProfitMarginAnnual}</Descriptions.Item>
                        <Descriptions.Item label="netProfitMarginTTM">{results.financials.metric.netProfitMarginTTM}</Descriptions.Item>
                        <Descriptions.Item label="operatingMargin5Y">{results.financials.metric.operatingMargin5Y}</Descriptions.Item>
                        <Descriptions.Item label="operatingMarginAnnual">{results.financials.metric.operatingMarginAnnual}</Descriptions.Item>
                        <Descriptions.Item label="operatingMarginTTM">{results.financials.metric.operatingMarginTTM}</Descriptions.Item>
                        <Descriptions.Item label="pretaxMargin5Y">{results.financials.metric.pretaxMargin5Y}</Descriptions.Item>
                        <Descriptions.Item label="pretaxMarginAnnual">{results.financials.metric.pretaxMarginAnnual}</Descriptions.Item>
                        <Descriptions.Item label="pretaxMarginTTM">{results.financials.metric.pretaxMarginTTM}</Descriptions.Item>
                    </Descriptions>
                    </TabPane>
                </Tabs>
                }
            >

            <Descriptions size="small" column={2}>
                <Descriptions.Item><Avatar src={results.description.logo} shape="square" size={64} icon={<UserOutlined />} /></Descriptions.Item>
                <Descriptions.Item><Statistic title="Price" prefix="$" value={results.quote.o} /></Descriptions.Item>
                <Descriptions.Item label="high">{results.quote.h}</Descriptions.Item>
                <Descriptions.Item label="low">{results.quote.l}</Descriptions.Item>
                <Descriptions.Item label="pc">{results.quote.pc}</Descriptions.Item>
                <Descriptions.Item label="c">{results.quote.c}</Descriptions.Item>
            </Descriptions>
            </PageHeader>
        </>
    )
}


export default Stock;