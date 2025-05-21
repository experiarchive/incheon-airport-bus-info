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
    },
    prepare(selection) {
      const {routeName, stopName, direction, dayTypeValue} = selection
      const dayTypeOptions = [
        {title: '평일', value: 'weekday'},
        {title: '주말/공휴일', value: 'weekend_holiday'},
        {title: '매일 (평일/주말 동일)', value: 'everyday'},
      ]
      const dayType = dayTypeOptions.find((opt) => opt.value === dayTypeValue)?.title || dayTypeValue

      return {
        title: `${routeName || '[노선 이름 없음]'} - ${stopName || '[정류장 이름 없음]'} (${direction || '[방향 없음]'}, ${dayType || '[요일 타입 없음]'})`,
      }
    },
  },
} 