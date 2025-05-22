export default {
  name: 'timetableEntry',
  title: 'Timetable Entry',
  type: 'document',
  fields: [
    {
      name: 'route',
      title: 'Route',
      type: 'reference',
      to: [{type: 'busRoute'}],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'dayType',
      title: 'Day Type',
      type: 'string',
      options: {
        list: [
          {title: '평일', value: 'weekday'},
          {title: '주말/공휴일', value: 'weekend_holiday'},
          {title: '매일 (평일/주말 동일)', value: 'everyday'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'direction',
      title: 'Direction',
      type: 'string',
      options: {
        list: ['공항행', '시내행'],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'departureTimes',
      title: '출발 시간 목록 (Departure Times)',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required(),
      description: 'HH:MM 형식으로 시간을 입력해주세요.',
    },
    {
      name: 'effectiveDate',
      title: '유효 시작일 (Effective Date)',
      type: 'date',
      description: '이 시간표가 적용되기 시작하는 날짜입니다.',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'status',
      title: '상태 (Status)',
      type: 'string',
      description: '시간표의 현재 상태를 선택합니다.',
      options: {
        list: [
          { title: '현재 적용 (Current)', value: 'current' },
          { title: '변경 예정 (Upcoming)', value: 'upcoming' },
          { title: '만료됨 (Expired)', value: 'expired' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'current',
    },
    {
      name: 'stopName',
      title: 'Stop Name',
      type: 'string',
    },
  ],
  preview: {
    select: {
      routeName: 'route.routeName',
      stopName: 'stopName',
      direction: 'direction',
      dayTypeValue: 'dayType',
      status: 'status',
      effectiveDate: 'effectiveDate',
    },
    prepare(selection) {
      const {routeName, stopName, direction, dayTypeValue, status, effectiveDate} = selection
      const dayTypeOptions = [
        {title: '평일', value: 'weekday'},
        {title: '주말/공휴일', value: 'weekend_holiday'},
        {title: '매일 (평일/주말 동일)', value: 'everyday'},
      ]
      const dayType = dayTypeOptions.find((opt) => opt.value === dayTypeValue)?.title || dayTypeValue

      const statusOptions = [
        { title: '현재 적용', value: 'current' },
        { title: '변경 예정', value: 'upcoming' },
        { title: '만료됨', value: 'expired' }
      ]
      const statusText = statusOptions.find((opt) => opt.value === status)?.title || status

      return {
        title: `${routeName || '[노선 이름 없음]'} - ${stopName || '[정류장 이름 없음]'} (${direction || '[방향 없음]'}, ${dayType || '[요일 타입 없음]'})`,
        subtitle: `상태: ${statusText || '[상태 없음]'} (적용일: ${effectiveDate || '[날짜 없음]'})`
      }
    },
  },
} 