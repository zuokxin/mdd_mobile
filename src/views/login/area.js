const areas = [
  {
    type: 'A',
    list: [
      {
        country_code: 'AL',
        english_name: 'Albania',
        chinese_name: '阿尔巴尼亚',
        chinese_pinyin: 'A ER BA NI YA',
        phone_code: '355'
      },
      {
        country_code: 'DZ',
        english_name: 'Algeria',
        chinese_name: '阿尔及利亚',
        chinese_pinyin: 'A ER JI LI YA',
        phone_code: '213'
      },
      {
        country_code: 'AF',
        english_name: 'Afghanistan',
        chinese_name: '阿富汗',
        chinese_pinyin: 'A FU HAN',
        phone_code: '93'
      },
      {
        country_code: 'AR',
        english_name: 'Argentina',
        chinese_name: '阿根廷',
        chinese_pinyin: 'A GEN TING',
        phone_code: '54'
      },
      {
        country_code: 'AE',
        english_name: 'United Arab Emirates',
        chinese_name: '阿拉伯联合酋长国',
        chinese_pinyin: 'A LA BO LIAN HE QIU ZHANG GUO',
        phone_code: '971'
      },
      {
        country_code: 'AW',
        english_name: 'Aruba',
        chinese_name: '阿鲁巴',
        chinese_pinyin: 'A LU BA',
        phone_code: '297'
      },
      {
        country_code: 'OM',
        english_name: 'Oman',
        chinese_name: '阿曼',
        chinese_pinyin: 'A MAN',
        phone_code: '968'
      },
      {
        country_code: 'AZ',
        english_name: 'Azerbaijan',
        chinese_name: '阿塞拜疆',
        chinese_pinyin: 'A SAI BAI JIANG',
        phone_code: '994'
      },
      {
        country_code: 'IE',
        english_name: 'Ireland',
        chinese_name: '爱尔兰',
        chinese_pinyin: 'AI ER LAN',
        phone_code: '353'
      },
      {
        country_code: 'EG',
        english_name: 'Egypt',
        chinese_name: '埃及',
        chinese_pinyin: 'AI JI',
        phone_code: '20'
      },
      {
        country_code: 'ET',
        english_name: 'Ethiopia',
        chinese_name: '埃塞俄比亚',
        chinese_pinyin: 'AI SAI E BI YA',
        phone_code: '251'
      },
      {
        country_code: 'EE',
        english_name: 'Estonia',
        chinese_name: '爱沙尼亚',
        chinese_pinyin: 'AI SHA NI YA',
        phone_code: '372'
      },
      {
        country_code: 'AD',
        english_name: 'Andorra',
        chinese_name: '安道尔',
        chinese_pinyin: 'AN DAO ER',
        phone_code: '376'
      },
      {
        country_code: 'AO',
        english_name: 'Angola',
        chinese_name: '安哥拉',
        chinese_pinyin: 'AN GE LA',
        phone_code: '244'
      },
      {
        country_code: 'AI',
        english_name: 'Anguilla',
        chinese_name: '安圭拉',
        chinese_pinyin: 'AN GUI LA',
        phone_code: '1264'
      },
      {
        country_code: 'AG',
        english_name: 'Antigua and Barbuda',
        chinese_name: '安提瓜和巴布达',
        chinese_pinyin: 'AN TI GUA HE BA BU DA',
        phone_code: '1268'
      },
      {
        country_code: 'AU',
        english_name: 'Australia',
        chinese_name: '澳大利亚',
        chinese_pinyin: 'AO DA LI YA',
        phone_code: '61'
      },
      {
        country_code: 'AT',
        english_name: 'Austria',
        chinese_name: '奥地利',
        chinese_pinyin: 'AO DE LI',
        phone_code: '43'
      }
    ]
  },
  {
    type: 'B',
    list: [
      {
        country_code: 'BB',
        english_name: 'Barbados',
        chinese_name: '巴巴多斯',
        chinese_pinyin: 'BA BA DUO SI',
        phone_code: '1246'
      },
      {
        country_code: 'PG',
        english_name: 'Papua New Guinea',
        chinese_name: '巴布亚新几内亚',
        chinese_pinyin: 'BA BU YA XIN JI NEI YA',
        phone_code: '675'
      },
      {
        country_code: 'BS',
        english_name: 'Bahamas',
        chinese_name: '巴哈马',
        chinese_pinyin: 'BA HA MA',
        phone_code: '1242'
      },
      {
        country_code: 'PK',
        english_name: 'Pakistan',
        chinese_name: '巴基斯坦',
        chinese_pinyin: 'BA JI SI TAN',
        phone_code: '92'
      },
      {
        country_code: 'PY',
        english_name: 'Paraguay',
        chinese_name: '巴拉圭',
        chinese_pinyin: 'BA LA GUI',
        phone_code: '595'
      },
      {
        country_code: 'BL',
        english_name: 'Palestine',
        chinese_name: '巴勒斯坦',
        chinese_pinyin: 'BA LEI SI TAN',
        phone_code: '970'
      },
      {
        country_code: 'BH',
        english_name: 'Bahrain',
        chinese_name: '巴林',
        chinese_pinyin: 'BA LIN',
        phone_code: '973'
      },
      {
        country_code: 'PA',
        english_name: 'Panama',
        chinese_name: '巴拿马',
        chinese_pinyin: 'BA NA MA',
        phone_code: '507'
      },
      {
        country_code: 'BR',
        english_name: 'Brazil',
        chinese_name: '巴西',
        chinese_pinyin: 'BA XI',
        phone_code: '55'
      },
      {
        country_code: 'BY',
        english_name: 'Belarus',
        chinese_name: '白俄罗斯',
        chinese_pinyin: 'BAI E LUO SI',
        phone_code: '375'
      },
      {
        country_code: 'BM',
        english_name: 'Bermuda',
        chinese_name: '百慕大群岛',
        chinese_pinyin: 'BAI MU DA QUN DAO',
        phone_code: '1441'
      },
      {
        country_code: 'BG',
        english_name: 'Bulgaria',
        chinese_name: '保加利亚',
        chinese_pinyin: 'BAO JIA LI YA',
        phone_code: '359'
      },
      {
        country_code: 'BJ',
        english_name: 'Benin',
        chinese_name: '贝宁',
        chinese_pinyin: 'BEI NING',
        phone_code: '229'
      },
      {
        country_code: 'BE',
        english_name: 'Belgium',
        chinese_name: '比利时',
        chinese_pinyin: 'BI LI SHI',
        phone_code: '32'
      },
      {
        country_code: 'PE',
        english_name: 'Peru',
        chinese_name: '秘鲁',
        chinese_pinyin: 'BI LU',
        phone_code: '51'
      },
      {
        country_code: 'IS',
        english_name: 'Iceland',
        chinese_name: '冰岛',
        chinese_pinyin: 'BING DAO',
        phone_code: '354'
      },
      {
        country_code: 'BW',
        english_name: 'Botswana',
        chinese_name: '博茨瓦纳',
        chinese_pinyin: 'BO CI WA NA',
        phone_code: '267'
      },
      {
        country_code: 'PR',
        english_name: 'Puerto Rico',
        chinese_name: '波多黎各',
        chinese_pinyin: 'BO DUO LI GE',
        phone_code: '1787'
      },
      {
        country_code: 'PL',
        english_name: 'Poland',
        chinese_name: '波兰',
        chinese_pinyin: 'BO LAN',
        phone_code: '48'
      },
      {
        country_code: 'BO',
        english_name: 'Bolivia',
        chinese_name: '玻利维亚',
        chinese_pinyin: 'BO LI WEI YA',
        phone_code: '591'
      },
      {
        country_code: 'BZ',
        english_name: 'Belize',
        chinese_name: '伯利兹',
        chinese_pinyin: 'BO LI ZI',
        phone_code: '501'
      },
      {
        country_code: 'BA',
        english_name: 'Bosnia and Herzegovina',
        chinese_name: '波斯尼亚和黑塞哥维那',
        chinese_pinyin: 'BO SI NI YA HE HEI SAI GE WEI NA',
        phone_code: '387'
      },
      {
        country_code: 'BT',
        english_name: 'Bhutan',
        chinese_name: '不丹',
        chinese_pinyin: 'BU DAN',
        phone_code: '975'
      },
      {
        country_code: 'BF',
        english_name: 'Burkina Faso',
        chinese_name: '布基纳法索',
        chinese_pinyin: 'BU JI NA FA SUO',
        phone_code: '226'
      },
      {
        country_code: 'BI',
        english_name: 'Burundi',
        chinese_name: '布隆迪',
        chinese_pinyin: 'BU LONG DI',
        phone_code: '257'
      }
    ]
  },
  {
    type: 'C',
    list: [
      {
        country_code: 'GQ',
        english_name: 'Equatorial Guinea',
        chinese_name: '赤道几内亚',
        chinese_pinyin: 'CHI DAO JI NEI YA',
        phone_code: '240'
      }
    ]
  },
  {
    type: 'D',
    list: [
      {
        country_code: 'DK',
        english_name: 'Denmark',
        chinese_name: '丹麦',
        chinese_pinyin: 'DAN MAI',
        phone_code: '45'
      },
      {
        country_code: 'DE',
        english_name: 'Germany',
        chinese_name: '德国',
        chinese_pinyin: 'DE GUO',
        phone_code: '49'
      },
      {
        country_code: 'TL',
        english_name: 'Timor-Leste',
        chinese_name: '东帝汶',
        chinese_pinyin: 'DONG DI WEN',
        phone_code: '670'
      },
      {
        country_code: 'TG',
        english_name: 'Togo',
        chinese_name: '多哥',
        chinese_pinyin: 'DUO GE',
        phone_code: '228'
      },
      {
        country_code: 'DM',
        english_name: 'Dominica',
        chinese_name: '多米尼加',
        chinese_pinyin: 'DUO MI NI JIA',
        phone_code: '1767'
      },
      {
        country_code: 'DO',
        english_name: 'Dominican Republic',
        chinese_name: '多米尼加共和国',
        chinese_pinyin: 'DUO MI NI JIA GONG HE GUO',
        phone_code: '1809'
      }
    ]
  },
  {
    type: 'E',
    list: [
      {
        country_code: 'EC',
        english_name: 'Ecuador',
        chinese_name: '厄瓜多尔',
        chinese_pinyin: 'E GUA DUO ER',
        phone_code: '593'
      },
      {
        country_code: 'ER',
        english_name: 'Eritrea',
        chinese_name: '厄立特里亚',
        chinese_pinyin: 'E LI TE LI YA',
        phone_code: '291'
      },
      {
        country_code: 'RU',
        english_name: 'Russia',
        chinese_name: '俄罗斯',
        chinese_pinyin: 'E LUO SI',
        phone_code: '7'
      }
    ]
  },
  {
    type: 'F',
    list: [
      {
        country_code: 'FR',
        english_name: 'France',
        chinese_name: '法国',
        chinese_pinyin: 'FA GUO',
        phone_code: '33'
      },
      {
        country_code: 'FO',
        english_name: 'Faroe Islands',
        chinese_name: '法罗群岛',
        chinese_pinyin: 'FA LUO QUN DAO',
        phone_code: '298'
      },
      {
        country_code: 'PF',
        english_name: 'French Polynesia',
        chinese_name: '法属波利尼西亚',
        chinese_pinyin: 'FA SHU BO LI NI XI YA',
        phone_code: '689'
      },
      {
        country_code: 'GF',
        english_name: 'French Guiana',
        chinese_name: '法属圭亚那',
        chinese_pinyin: 'FA SHU GUI YA NA',
        phone_code: '594'
      },
      {
        country_code: 'FJ',
        english_name: 'Fiji',
        chinese_name: '斐济',
        chinese_pinyin: 'FEI JI',
        phone_code: '679'
      },
      {
        country_code: 'PH',
        english_name: 'Philippines',
        chinese_name: '菲律宾',
        chinese_pinyin: 'FEI LU BIN',
        phone_code: '63'
      },
      {
        country_code: 'FI',
        english_name: 'Finland',
        chinese_name: '芬兰',
        chinese_pinyin: 'FEN LAN',
        phone_code: '358'
      }
    ]
  },
  {
    type: 'G',
    list: [
      {
        country_code: 'GM',
        english_name: 'Gambia',
        chinese_name: '冈比亚',
        chinese_pinyin: 'GANG BI YA',
        phone_code: '220'
      },
      {
        country_code: 'CG',
        english_name: 'Republic Of The Congo',
        chinese_name: '刚果共和国',
        chinese_pinyin: 'GANG GUO GONG HE GUO',
        phone_code: '242'
      },
      {
        country_code: 'CD',
        english_name: 'Democratic Republic of the Congo',
        chinese_name: '刚果民主共和国',
        chinese_pinyin: 'GANG GUO MIN ZHU GONG HE GUO',
        phone_code: '243'
      },
      {
        country_code: 'GD',
        english_name: 'Grenada',
        chinese_name: '格林纳达',
        chinese_pinyin: 'GE LIN NA DA',
        phone_code: '1473'
      },
      {
        country_code: 'GL',
        english_name: 'Greenland',
        chinese_name: '格陵兰岛',
        chinese_pinyin: 'GE LING LAN DAO',
        phone_code: '299'
      },
      {
        country_code: 'GE',
        english_name: 'Georgia',
        chinese_name: '格鲁吉亚',
        chinese_pinyin: 'GE LU JI YA',
        phone_code: '995'
      },
      {
        country_code: 'CO',
        english_name: 'Colombia',
        chinese_name: '哥伦比亚',
        chinese_pinyin: 'GE LUN BI YA',
        phone_code: '57'
      },
      {
        country_code: 'CR',
        english_name: 'Costa Rica',
        chinese_name: '哥斯达黎加',
        chinese_pinyin: 'GE SI DA LI JIA',
        phone_code: '506'
      },
      {
        country_code: 'CU',
        english_name: 'Cuba',
        chinese_name: '古巴',
        chinese_pinyin: 'GU BA',
        phone_code: '53'
      },
      {
        country_code: 'GP',
        english_name: 'Guadeloupe',
        chinese_name: '瓜德罗普岛',
        chinese_pinyin: 'GUA DE LUO PU DAO',
        phone_code: '590'
      },
      {
        country_code: 'GT',
        english_name: 'Guatemala',
        chinese_name: '瓜地马拉',
        chinese_pinyin: 'GUA DE MA LA',
        phone_code: '502'
      },
      {
        country_code: 'GU',
        english_name: 'Guam',
        chinese_name: '关岛',
        chinese_pinyin: 'GUAN DAO',
        phone_code: '1671'
      },
      {
        country_code: 'GY',
        english_name: 'Guyana',
        chinese_name: '圭亚那',
        chinese_pinyin: 'GUI YA NA',
        phone_code: '592'
      }
    ]
  },
  {
    type: 'H',
    list: [
      {
        country_code: 'KZ',
        english_name: 'Kazakhstan',
        chinese_name: '哈萨克斯坦',
        chinese_pinyin: 'HA SA KE SI TAN',
        phone_code: '7'
      },
      {
        country_code: 'HT',
        english_name: 'Haiti',
        chinese_name: '海地',
        chinese_pinyin: 'HAI DE',
        phone_code: '509'
      },
      {
        country_code: 'KR',
        english_name: 'South Korea',
        chinese_name: '韩国',
        chinese_pinyin: 'HAN GUO',
        phone_code: '82'
      },
      {
        country_code: 'NL',
        english_name: 'Netherlands',
        chinese_name: '荷兰',
        chinese_pinyin: 'HE LAN',
        phone_code: '31'
      },
      {
        country_code: 'ME',
        english_name: 'Montenegro',
        chinese_name: '黑山',
        chinese_pinyin: 'HEI SHAN',
        phone_code: '382'
      },
      {
        country_code: 'HN',
        english_name: 'Honduras',
        chinese_name: '洪都拉斯',
        chinese_pinyin: 'HONG DOU LA SI',
        phone_code: '504'
      }
    ]
  },
  {
    type: 'J',
    list: [
      {
        country_code: 'DJ',
        english_name: 'Djibouti',
        chinese_name: '吉布提',
        chinese_pinyin: 'JI BU TI',
        phone_code: '253'
      },
      {
        country_code: 'KG',
        english_name: 'Kyrgyzstan',
        chinese_name: '吉尔吉斯斯坦',
        chinese_pinyin: 'JI ER JI SI SI TAN',
        phone_code: '996'
      },
      {
        country_code: 'KI',
        english_name: 'Kiribati',
        chinese_name: '基里巴斯',
        chinese_pinyin: 'JI LI BA SI',
        phone_code: '686'
      },
      {
        country_code: 'GN',
        english_name: 'Guinea',
        chinese_name: '几内亚',
        chinese_pinyin: 'JI NEI YA',
        phone_code: '224'
      },
      {
        country_code: 'GW',
        english_name: 'Guinea-Bissau',
        chinese_name: '几内亚比绍共和国',
        chinese_pinyin: 'JI NEI YA BI SHAO GONG HE GUO',
        phone_code: '245'
      },
      {
        country_code: 'GH',
        english_name: 'Ghana',
        chinese_name: '加纳',
        chinese_pinyin: 'JIA NA',
        phone_code: '233'
      },
      {
        country_code: 'CA',
        english_name: 'Canada',
        chinese_name: '加拿大',
        chinese_pinyin: 'JIA NA DA',
        phone_code: '1'
      },
      {
        country_code: 'GA',
        english_name: 'Gabon',
        chinese_name: '加蓬',
        chinese_pinyin: 'JIA PENG',
        phone_code: '241'
      },
      {
        country_code: 'KH',
        english_name: 'Cambodia',
        chinese_name: '柬埔寨',
        chinese_pinyin: 'JIAN BU ZHAI',
        phone_code: '855'
      },
      {
        country_code: 'CZ',
        english_name: 'Czech',
        chinese_name: '捷克',
        chinese_pinyin: 'JIE KE',
        phone_code: '420'
      },
      {
        country_code: 'ZW',
        english_name: 'Zimbabwe',
        chinese_name: '津巴布韦',
        chinese_pinyin: 'JIN BA BU WEI',
        phone_code: '263'
      }
    ]
  },
  {
    type: 'K',
    list: [
      {
        country_code: 'CM',
        english_name: 'Cameroon',
        chinese_name: '喀麦隆',
        chinese_pinyin: 'KA MAI LONG',
        phone_code: '237'
      },
      {
        country_code: 'QA',
        english_name: 'Qatar',
        chinese_name: '卡塔尔',
        chinese_pinyin: 'KA TA ER',
        phone_code: '974'
      },
      {
        country_code: 'KY',
        english_name: 'Cayman Islands',
        chinese_name: '开曼群岛',
        chinese_pinyin: 'KAI MAN QUN DAO',
        phone_code: '1345'
      },
      {
        country_code: 'CV',
        english_name: 'Cape Verde',
        chinese_name: '开普',
        chinese_pinyin: 'KAI PU',
        phone_code: '238'
      },
      {
        country_code: 'HR',
        english_name: 'Croatia',
        chinese_name: '克罗地亚',
        chinese_pinyin: 'KE LUO DE YA',
        phone_code: '385'
      },
      {
        country_code: 'KM',
        english_name: 'Comoros',
        chinese_name: '科摩罗',
        chinese_pinyin: 'KE MO LUO',
        phone_code: '269'
      },
      {
        country_code: 'KW',
        english_name: 'Kuwait',
        chinese_name: '科威特',
        chinese_pinyin: 'KE WEI TE',
        phone_code: '965'
      },
      {
        country_code: 'KE',
        english_name: 'Kenya',
        chinese_name: '肯尼亚',
        chinese_pinyin: 'KEN NI YA',
        phone_code: '254'
      },
      {
        country_code: 'CK',
        english_name: 'Cook Islands',
        chinese_name: '库克群岛',
        chinese_pinyin: 'KU KE QUN DAO',
        phone_code: '682'
      },
      {
        country_code: 'CW',
        english_name: 'Curacao',
        chinese_name: '库拉索',
        chinese_pinyin: 'KU LA SUO',
        phone_code: '599'
      }
    ]
  },
  {
    type: 'L',
    list: [
      {
        country_code: 'LV',
        english_name: 'Latvia',
        chinese_name: '拉脱维亚',
        chinese_pinyin: 'LA TUO WEI YA',
        phone_code: '371'
      },
      {
        country_code: 'LS',
        english_name: 'Lesotho',
        chinese_name: '莱索托',
        chinese_pinyin: 'LAI SUO TUO',
        phone_code: '266'
      },
      {
        country_code: 'LA',
        english_name: 'Laos',
        chinese_name: '老挝',
        chinese_pinyin: 'LAO WO',
        phone_code: '856'
      },
      {
        country_code: 'LB',
        english_name: 'Lebanon',
        chinese_name: '黎巴嫩',
        chinese_pinyin: 'LI BA NEN',
        phone_code: '961'
      },
      {
        country_code: 'LR',
        english_name: 'Liberia',
        chinese_name: '利比里亚',
        chinese_pinyin: 'LI BI LI YA',
        phone_code: '231'
      },
      {
        country_code: 'LY',
        english_name: 'Libya',
        chinese_name: '利比亚',
        chinese_pinyin: 'LI BI YA',
        phone_code: '218'
      },
      {
        country_code: 'LT',
        english_name: 'Lithuania',
        chinese_name: '立陶宛',
        chinese_pinyin: 'LI TAO WAN',
        phone_code: '370'
      },
      {
        country_code: 'LI',
        english_name: 'Liechtenstein',
        chinese_name: '列支敦士登',
        chinese_pinyin: 'LIE ZHI DUN SHI DENG',
        phone_code: '423'
      },
      {
        country_code: 'RE',
        english_name: 'Réunion Island',
        chinese_name: '留尼汪',
        chinese_pinyin: 'LIU NI WANG',
        phone_code: '262'
      },
      {
        country_code: 'LU',
        english_name: 'Luxembourg',
        chinese_name: '卢森堡',
        chinese_pinyin: 'LU SEN BAO',
        phone_code: '352'
      },
      {
        country_code: 'RW',
        english_name: 'Rwanda',
        chinese_name: '卢旺达',
        chinese_pinyin: 'LU WANG DA',
        phone_code: '250'
      },
      {
        country_code: 'RO',
        english_name: 'Romania',
        chinese_name: '罗马尼亚',
        chinese_pinyin: 'LUO MA NI YA',
        phone_code: '40'
      }
    ]
  },
  {
    type: 'M',
    list: [
      {
        country_code: 'MG',
        english_name: 'Madagascar',
        chinese_name: '马达加斯加',
        chinese_pinyin: 'MA DA JIA SI JIA',
        phone_code: '261'
      },
      {
        country_code: 'MV',
        english_name: 'Maldives',
        chinese_name: '马尔代夫',
        chinese_pinyin: 'MA ER DAI FU',
        phone_code: '960'
      },
      {
        country_code: 'MT',
        english_name: 'Malta',
        chinese_name: '马耳他',
        chinese_pinyin: 'MA ER TA',
        phone_code: '356'
      },
      {
        country_code: 'MW',
        english_name: 'Malawi',
        chinese_name: '马拉维',
        chinese_pinyin: 'MA LA WEI',
        phone_code: '265'
      },
      {
        country_code: 'MY',
        english_name: 'Malaysia',
        chinese_name: '马来西亚',
        chinese_pinyin: 'MA LAI XI YA',
        phone_code: '60'
      },
      {
        country_code: 'ML',
        english_name: 'Mali',
        chinese_name: '马里',
        chinese_pinyin: 'MA LI',
        phone_code: '223'
      },
      {
        country_code: 'MK',
        english_name: 'Macedonia',
        chinese_name: '马其顿',
        chinese_pinyin: 'MA QI DUN',
        phone_code: '389'
      },
      {
        country_code: 'MQ',
        english_name: 'Martinique',
        chinese_name: '马提尼克',
        chinese_pinyin: 'MA TI NI KE',
        phone_code: '596'
      },
      {
        country_code: 'YT',
        english_name: 'Mayotte',
        chinese_name: '马约特',
        chinese_pinyin: 'MA YUE TE',
        phone_code: '269'
      },
      {
        country_code: 'MU',
        english_name: 'Mauritius',
        chinese_name: '毛里求斯',
        chinese_pinyin: 'MAO LI QIU SI',
        phone_code: '230'
      },
      {
        country_code: 'MR',
        english_name: 'Mauritania',
        chinese_name: '毛里塔尼亚',
        chinese_pinyin: 'MAO LI TA NI YA',
        phone_code: '222'
      },
      {
        country_code: 'US',
        english_name: 'United States',
        chinese_name: '美国',
        chinese_pinyin: 'MEI GUO',
        phone_code: '1'
      },
      {
        country_code: 'AS',
        english_name: 'American Samoa',
        chinese_name: '美属萨摩亚',
        chinese_pinyin: 'MEI SHU SA MO YA',
        phone_code: '1684'
      },
      {
        country_code: 'VI',
        english_name: 'Virgin Islands, US',
        chinese_name: '美属维尔京群岛',
        chinese_pinyin: 'MEI SHU WEI ER JING QUN DAO',
        phone_code: '1284'
      },
      {
        country_code: 'MN',
        english_name: 'Mongolia',
        chinese_name: '蒙古',
        chinese_pinyin: 'MENG GU',
        phone_code: '976'
      },
      {
        country_code: 'BD',
        english_name: 'Bangladesh',
        chinese_name: '孟加拉国',
        chinese_pinyin: 'MENG JIA LA GUO',
        phone_code: '880'
      },
      {
        country_code: 'MS',
        english_name: 'Montserrat',
        chinese_name: '蒙特塞拉特岛',
        chinese_pinyin: 'MENG TE SAI LA TE DAO',
        phone_code: '1664'
      },
      {
        country_code: 'MM',
        english_name: 'Myanmar',
        chinese_name: '缅甸',
        chinese_pinyin: 'MIAN DIAN',
        phone_code: '95'
      },
      {
        country_code: 'MD',
        english_name: 'Moldova',
        chinese_name: '摩尔多瓦',
        chinese_pinyin: 'MO ER DUO WA',
        phone_code: '373'
      },
      {
        country_code: 'MA',
        english_name: 'Morocco',
        chinese_name: '摩洛哥',
        chinese_pinyin: 'MO LUO GE',
        phone_code: '212'
      },
      {
        country_code: 'MC',
        english_name: 'Monaco',
        chinese_name: '摩纳哥',
        chinese_pinyin: 'MO NA GE',
        phone_code: '377'
      },
      {
        country_code: 'MZ',
        english_name: 'Mozambique',
        chinese_name: '莫桑比克',
        chinese_pinyin: 'MO SANG BI KE',
        phone_code: '258'
      },
      {
        country_code: 'MX',
        english_name: 'Mexico',
        chinese_name: '墨西哥',
        chinese_pinyin: 'MO XI GE',
        phone_code: '52'
      }
    ]
  },
  {
    type: 'N',
    list: [
      {
        country_code: 'NA',
        english_name: 'Namibia',
        chinese_name: '纳米比亚',
        chinese_pinyin: 'NA MI BI YA',
        phone_code: '264'
      },
      {
        country_code: 'ZA',
        english_name: 'South Africa',
        chinese_name: '南非',
        chinese_pinyin: 'NAN FEI',
        phone_code: '27'
      },
      {
        country_code: 'NI',
        english_name: 'Nicaragua',
        chinese_name: '尼加拉瓜',
        chinese_pinyin: 'NI JIA LA GUA',
        phone_code: '505'
      },
      {
        country_code: 'NP',
        english_name: 'Nepal',
        chinese_name: '尼泊尔',
        chinese_pinyin: 'NI PO ER',
        phone_code: '977'
      },
      {
        country_code: 'NE',
        english_name: 'Niger',
        chinese_name: '尼日尔',
        chinese_pinyin: 'NI RI ER',
        phone_code: '227'
      },
      {
        country_code: 'NG',
        english_name: 'Nigeria',
        chinese_name: '尼日利亚',
        chinese_pinyin: 'NI RI LI YA',
        phone_code: '234'
      },
      {
        country_code: 'NO',
        english_name: 'Norway',
        chinese_name: '挪威',
        chinese_pinyin: 'NUO WEI',
        phone_code: '47'
      }
    ]
  },
  {
    type: 'P',
    list: [
      {
        country_code: 'PW',
        english_name: 'Palau',
        chinese_name: '帕劳',
        chinese_pinyin: 'PA LAO',
        phone_code: '680'
      },
      {
        country_code: 'PT',
        english_name: 'Portugal',
        chinese_name: '葡萄牙',
        chinese_pinyin: 'PU TAO YA',
        phone_code: '351'
      }
    ]
  },
  {
    type: 'R',
    list: [
      {
        country_code: 'JP',
        english_name: 'Japan',
        chinese_name: '日本',
        chinese_pinyin: 'RI BEN',
        phone_code: '81'
      },
      {
        country_code: 'SE',
        english_name: 'Sweden',
        chinese_name: '瑞典',
        chinese_pinyin: 'RUI DIAN',
        phone_code: '46'
      },
      {
        country_code: 'CH',
        english_name: 'Switzerland',
        chinese_name: '瑞士',
        chinese_pinyin: 'RUI SHI',
        phone_code: '41'
      }
    ]
  },
  {
    type: 'S',
    list: [
      {
        country_code: 'SV',
        english_name: 'El Salvador',
        chinese_name: '萨尔瓦多',
        chinese_pinyin: 'SA ER WA DUO',
        phone_code: '503'
      },
      {
        country_code: 'WS',
        english_name: 'Samoa',
        chinese_name: '萨摩亚',
        chinese_pinyin: 'SA MO YA',
        phone_code: '685'
      },
      {
        country_code: 'RS',
        english_name: 'Serbia',
        chinese_name: '塞尔维亚',
        chinese_pinyin: 'SAI ER WEI YA',
        phone_code: '381'
      },
      {
        country_code: 'SL',
        english_name: 'Sierra Leone',
        chinese_name: '塞拉利昂',
        chinese_pinyin: 'SAI LA LI ANG',
        phone_code: '232'
      },
      {
        country_code: 'SN',
        english_name: 'Senegal',
        chinese_name: '塞内加尔',
        chinese_pinyin: 'SAI NEI JIA ER',
        phone_code: '221'
      },
      {
        country_code: 'CY',
        english_name: 'Cyprus',
        chinese_name: '塞浦路斯',
        chinese_pinyin: 'SAI PU LU SI',
        phone_code: '357'
      },
      {
        country_code: 'SC',
        english_name: 'Seychelles',
        chinese_name: '塞舌尔',
        chinese_pinyin: 'SAI SHE ER',
        phone_code: '248'
      },
      {
        country_code: 'SA',
        english_name: 'Saudi Arabia',
        chinese_name: '沙特阿拉伯',
        chinese_pinyin: 'SHA TE A LA BO',
        phone_code: '966'
      },
      {
        country_code: 'PM',
        english_name: 'Saint Pierre and Miquelon',
        chinese_name: '圣彼埃尔和密克隆岛',
        chinese_pinyin: 'SHENG BI AI ER HE MI KE LONG DAO',
        phone_code: '508'
      },
      {
        country_code: 'ST',
        english_name: 'Sao Tome and Principe',
        chinese_name: '圣多美和普林西比',
        chinese_pinyin: 'SHENG DUO MEI HE PU LIN XI BI',
        phone_code: '239'
      },
      {
        country_code: 'KN',
        english_name: 'Saint Kitts and Nevis',
        chinese_name: '圣基茨和尼维斯',
        chinese_pinyin: 'SHENG JI CI HE NI WEI SI',
        phone_code: '1869'
      },
      {
        country_code: 'LC',
        english_name: 'Saint Lucia',
        chinese_name: '圣露西亚',
        chinese_pinyin: 'SHENG LU XI YA',
        phone_code: '1758'
      },
      {
        country_code: 'SX',
        english_name: 'Saint Maarten (Dutch Part)',
        chinese_name: '圣马丁岛（荷兰部分）',
        chinese_pinyin: 'SHENG MA DING DAO （HE LAN BU FEN）',
        phone_code: '1721'
      },
      {
        country_code: 'SM',
        english_name: 'San Marino',
        chinese_name: '圣马力诺',
        chinese_pinyin: 'SHENG MA LI NUO',
        phone_code: '378'
      },
      {
        country_code: 'VC',
        english_name: 'Saint Vincent and The Grenadines',
        chinese_name: '圣文森特和格林纳丁斯',
        chinese_pinyin: 'SHENG WEN SEN TE HE GE LIN NA DING SI',
        phone_code: '1784'
      },
      {
        country_code: 'LK',
        english_name: 'Sri Lanka',
        chinese_name: '斯里兰卡',
        chinese_pinyin: 'SI LI LAN KA',
        phone_code: '94'
      },
      {
        country_code: 'SK',
        english_name: 'Slovakia',
        chinese_name: '斯洛伐克',
        chinese_pinyin: 'SI LUO FA KE',
        phone_code: '421'
      },
      {
        country_code: 'SI',
        english_name: 'Slovenia',
        chinese_name: '斯洛文尼亚',
        chinese_pinyin: 'SI LUO WEN NI YA',
        phone_code: '386'
      },
      {
        country_code: 'SZ',
        english_name: 'Swaziland',
        chinese_name: '斯威士兰',
        chinese_pinyin: 'SI WEI SHI LAN',
        phone_code: '268'
      },
      {
        country_code: 'SD',
        english_name: 'Sudan',
        chinese_name: '苏丹',
        chinese_pinyin: 'SU DAN',
        phone_code: '249'
      },
      {
        country_code: 'SR',
        english_name: 'Suriname',
        chinese_name: '苏里南',
        chinese_pinyin: 'SU LI NAN',
        phone_code: '597'
      },
      {
        country_code: 'SB',
        english_name: 'Solomon Islands',
        chinese_name: '所罗门群岛',
        chinese_pinyin: 'SUO LUO MEN QUN DAO',
        phone_code: '677'
      },
      {
        country_code: 'SO',
        english_name: 'Somalia',
        chinese_name: '索马里',
        chinese_pinyin: 'SUO MA LI',
        phone_code: '252'
      }
    ]
  },
  {
    type: 'T',
    list: [
      {
        country_code: 'TJ',
        english_name: 'Tajikistan',
        chinese_name: '塔吉克斯坦',
        chinese_pinyin: 'TA JI KE SI TAN',
        phone_code: '992'
      },
      {
        country_code: 'TH',
        english_name: 'Thailand',
        chinese_name: '泰国',
        chinese_pinyin: 'TAI GUO',
        phone_code: '66'
      },
      {
        country_code: 'TZ',
        english_name: 'Tanzania',
        chinese_name: '坦桑尼亚',
        chinese_pinyin: 'TAN SANG NI YA',
        phone_code: '255'
      },
      {
        country_code: 'TO',
        english_name: 'Tonga',
        chinese_name: '汤加',
        chinese_pinyin: 'TANG JIA',
        phone_code: '676'
      },
      {
        country_code: 'TC',
        english_name: 'Turks and Caicos Islands',
        chinese_name: '特克斯和凯科斯群岛',
        chinese_pinyin: 'TE KE SI HE KAI KE SI QUN DAO',
        phone_code: '1649'
      },
      {
        country_code: 'TT',
        english_name: 'Trinidad and Tobago',
        chinese_name: '特立尼达和多巴哥',
        chinese_pinyin: 'TE LI NI DA HE DUO BA GE',
        phone_code: '1868'
      },
      {
        country_code: 'TR',
        english_name: 'Turkey',
        chinese_name: '土耳其',
        chinese_pinyin: 'TU ER QI',
        phone_code: '90'
      },
      {
        country_code: 'TM',
        english_name: 'Turkmenistan',
        chinese_name: '土库曼斯坦',
        chinese_pinyin: 'TU KU MAN SI TAN',
        phone_code: '993'
      },
      {
        country_code: 'TN',
        english_name: 'Tunisia',
        chinese_name: '突尼斯',
        chinese_pinyin: 'TU NI SI',
        phone_code: '216'
      }
    ]
  },
  {
    type: 'W',
    list: [
      {
        country_code: 'VU',
        english_name: 'Vanuatu',
        chinese_name: '瓦努阿图',
        chinese_pinyin: 'WA NU A TU',
        phone_code: '678'
      },
      {
        country_code: 'VE',
        english_name: 'Venezuela',
        chinese_name: '委内瑞拉',
        chinese_pinyin: 'WEI NEI RUI LA',
        phone_code: '58'
      },
      {
        country_code: 'BN',
        english_name: 'Brunei',
        chinese_name: '文莱',
        chinese_pinyin: 'WEN LAI',
        phone_code: '673'
      },
      {
        country_code: 'UG',
        english_name: 'Uganda',
        chinese_name: '乌干达',
        chinese_pinyin: 'WU GAN DA',
        phone_code: '256'
      },
      {
        country_code: 'UA',
        english_name: 'Ukraine',
        chinese_name: '乌克兰',
        chinese_pinyin: 'WU KE LAN',
        phone_code: '380'
      },
      {
        country_code: 'UY',
        english_name: 'Uruguay',
        chinese_name: '乌拉圭',
        chinese_pinyin: 'WU LA GUI',
        phone_code: '598'
      },
      {
        country_code: 'UZ',
        english_name: 'Uzbekistan',
        chinese_name: '乌兹别克斯坦',
        chinese_pinyin: 'WU ZI BIE KE SI TAN',
        phone_code: '998'
      }
    ]
  },
  {
    type: 'X',
    list: [
      {
        country_code: 'ES',
        english_name: 'Spain',
        chinese_name: '西班牙',
        chinese_pinyin: 'XI BAN YA',
        phone_code: '34'
      },
      {
        country_code: 'GR',
        english_name: 'Greece',
        chinese_name: '希腊',
        chinese_pinyin: 'XI LA',
        phone_code: '30'
      },
      {
        country_code: 'CI',
        english_name: 'Ivory Coast',
        chinese_name: '象牙海岸',
        chinese_pinyin: 'XIANG YA HAI AN',
        phone_code: '225'
      },
      {
        country_code: 'SG',
        english_name: 'Singapore',
        chinese_name: '新加坡',
        chinese_pinyin: 'XIN JIA PO',
        phone_code: '65'
      },
      {
        country_code: 'NC',
        english_name: 'New Caledonia',
        chinese_name: '新喀里多尼亚',
        chinese_pinyin: 'XIN KA LI DUO NI YA',
        phone_code: '687'
      },
      {
        country_code: 'NZ',
        english_name: 'New Zealand',
        chinese_name: '新西兰',
        chinese_pinyin: 'XIN XI LAN',
        phone_code: '64'
      },
      {
        country_code: 'HU',
        english_name: 'Hungary',
        chinese_name: '匈牙利',
        chinese_pinyin: 'XIONG YA LI',
        phone_code: '36'
      },
      {
        country_code: 'SY',
        english_name: 'Syria',
        chinese_name: '叙利亚',
        chinese_pinyin: 'XU LI YA',
        phone_code: '963'
      }
    ]
  },
  {
    type: 'Y',
    list: [
      {
        country_code: 'JM',
        english_name: 'Jamaica',
        chinese_name: '牙买加',
        chinese_pinyin: 'YA MAI JIA',
        phone_code: '1876'
      },
      {
        country_code: 'AM',
        english_name: 'Armenia',
        chinese_name: '亚美尼亚',
        chinese_pinyin: 'YA MEI NI YA',
        phone_code: '374'
      },
      {
        country_code: 'YE',
        english_name: 'Yemen',
        chinese_name: '也门',
        chinese_pinyin: 'YE MEN',
        phone_code: '967'
      },
      {
        country_code: 'IT',
        english_name: 'Italy',
        chinese_name: '意大利',
        chinese_pinyin: 'YI DA LI',
        phone_code: '39'
      },
      {
        country_code: 'IQ',
        english_name: 'Iraq',
        chinese_name: '伊拉克',
        chinese_pinyin: 'YI LA KE',
        phone_code: '964'
      },
      {
        country_code: 'IR',
        english_name: 'Iran',
        chinese_name: '伊朗',
        chinese_pinyin: 'YI LANG',
        phone_code: '98'
      },
      {
        country_code: 'IL',
        english_name: 'Israel',
        chinese_name: '以色列',
        chinese_pinyin: 'YI SE LIE',
        phone_code: '972'
      },
      {
        country_code: 'IN',
        english_name: 'India',
        chinese_name: '印度',
        chinese_pinyin: 'YIN DU',
        phone_code: '91'
      },
      {
        country_code: 'ID',
        english_name: 'Indonesia',
        chinese_name: '印度尼西亚',
        chinese_pinyin: 'YIN DU NI XI YA',
        phone_code: '62'
      },
      {
        country_code: 'GB',
        english_name: 'United Kingdom',
        chinese_name: '英国',
        chinese_pinyin: 'YING GUO',
        phone_code: '44'
      },
      {
        country_code: 'VG',
        english_name: 'Virgin Islands, British',
        chinese_name: '英属处女群岛',
        chinese_pinyin: 'YING SHU CHU NU QUN DAO',
        phone_code: '1340'
      },
      {
        country_code: 'JO',
        english_name: 'Jordan',
        chinese_name: '约旦',
        chinese_pinyin: 'YUE DAN',
        phone_code: '962'
      },
      {
        country_code: 'VN',
        english_name: 'Vietnam',
        chinese_name: '越南',
        chinese_pinyin: 'YUE NAN',
        phone_code: '84'
      }
    ]
  },
  {
    type: 'Z',
    list: [
      {
        country_code: 'ZM',
        english_name: 'Zambia',
        chinese_name: '赞比亚',
        chinese_pinyin: 'ZAN BI YA',
        phone_code: '260'
      },
      {
        country_code: 'TD',
        english_name: 'Chad',
        chinese_name: '乍得',
        chinese_pinyin: 'ZHA DE',
        phone_code: '235'
      },
      {
        country_code: 'GI',
        english_name: 'Gibraltar',
        chinese_name: '直布罗陀',
        chinese_pinyin: 'ZHI BU LUO TUO',
        phone_code: '350'
      },
      {
        country_code: 'CL',
        english_name: 'Chile',
        chinese_name: '智利',
        chinese_pinyin: 'ZHI LI',
        phone_code: '56'
      },
      {
        country_code: 'CF',
        english_name: 'Central African Republic',
        chinese_name: '中非共和国',
        chinese_pinyin: 'ZHONG FEI GONG HE GUO',
        phone_code: '236'
      },
      {
        country_code: 'CN',
        english_name: 'China',
        chinese_name: '中国',
        chinese_pinyin: 'ZHONG GUO',
        phone_code: '86'
      },
      {
        country_code: 'MO',
        english_name: 'Macau',
        chinese_name: '中国澳门',
        chinese_pinyin: 'ZHONG GUO AO MEN',
        phone_code: '853'
      },
      {
        country_code: 'TW',
        english_name: 'Taiwan',
        chinese_name: '中国台湾',
        chinese_pinyin: 'ZHONG GUO TAI WAN',
        phone_code: '886'
      },
      {
        country_code: 'HK',
        english_name: 'Hong Kong',
        chinese_name: '中国香港',
        chinese_pinyin: 'ZHONG GUO XIANG GANG',
        phone_code: '852'
      }
    ]
  }
]
export {
  areas
}
