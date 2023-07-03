import React, { useEffect, useRef, useState } from 'react'
import { Block } from './Block'
import './index.scss'
import axios from 'axios'

function App() {
	const [fromCurrency, setFromCurrency] = useState('RUB')
	const [toCurrency, setToCurrency] = useState('USD')
	const [fromPrice, setFromPrice] = useState(0)
	const [toPrice, setToPrice] = useState(1)

	const ratesRef = useRef({})

	useEffect(() => {
		axios
			.get('https://www.cbr-xml-daily.ru/latest.js')
			.then(res => {
				ratesRef.current = { ...res.data.rates, RUB: 1 }
				onChangeToPrice(1)
			})
			.catch(err => {
				console.warn(err)
				alert('Не удалось получить информацию')
			})
	}, [])
	const onChangeFromPrice = value => {
		if (fromCurrency === 'RUB') {
			const result = value * ratesRef.current[toCurrency]
			setToPrice(result.toFixed(2))
		} else {
			const resultAnyway =
				(ratesRef.current[toCurrency] / ratesRef.current[fromCurrency]) * value
			setToPrice(resultAnyway.toFixed(2))
		}

		setFromPrice(value)
	}
	const onChangeToPrice = value => {
		if (toCurrency === 'RUB') {
			const result = value * ratesRef.current[fromCurrency]
			setFromPrice(result.toFixed(2))
		} else {
			const resultAnyway =
				(ratesRef.current[fromCurrency] / ratesRef.current[toCurrency]) * value
			setFromPrice(resultAnyway.toFixed(2))
		}

		setToPrice(value)
	}

	useEffect(() => {
		onChangeFromPrice(fromPrice)
	}, [toCurrency])

	useEffect(() => {
		onChangeToPrice(toPrice)
	}, [fromCurrency])

	return (
		<div className='App'>
			<Block
				value={fromPrice}
				currency={fromCurrency}
				onChangeCurrency={setFromCurrency}
				onChangeValue={onChangeFromPrice}
			/>
			<Block
				value={toPrice}
				currency={toCurrency}
				onChangeCurrency={setToCurrency}
				onChangeValue={onChangeToPrice}
			/>
		</div>
	)
}

export default App
