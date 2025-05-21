export default {
  name: 'busRoute',
  title: 'Bus Route',
  type: 'document',
  fields: [
    {
      name: 'routeName',
      title: 'Route Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'routeNumber',
      title: 'Route Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        isUnique: true,
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'mainStops',
      title: 'Main Stops',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'timetableNotes',
      title: 'Timetable Notes',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'kakaoMapIframeUrl',
      title: 'Kakao Map Iframe URL',
      type: 'url',
    },
    {
      name: 'usageGuide',
      title: '이용 안내 (Usage Guide)',
      type: 'array',
      of: [{type: 'block'}],
      description: '해당 노선의 예매 방법, 결제 수단, 분실물 문의 등 상세 이용 안내를 입력합니다.',
    },
  ],
} 