'use strict';

const SQ ="sq";//阿尔巴尼亚语
const AM="am";//阿姆哈拉语
const GA="ga"; //爱尔兰语
const EU="eu"; //巴斯克语
const BG="bg";//保加利亚语
const PL="pl";//波兰语
const FA="fa";//波斯语
const DA="da";//丹麦语
const RU="ru";//俄语
const TL="tl";//菲律宾语
const FY="fy";//弗里西语
const KA="ka";//格鲁吉亚语
const KK="kk";//哈萨克语
const KO="ko";//韩语        
const NL="nl";//荷兰语
const GL="gl";//加利西亚语
const CS="cs";//捷克语
const CO="co";//科西嘉语
const KU="ku";//库尔德语
const LV="lv";//拉脱维亚语
const LT="lt";//立陶宛语 
const RO="ro";//罗马尼亚语
const MT="mt";//马耳他语
const ML="ml";//马拉雅拉姆语
const MK="mk";//马其顿语
const MN="mn";//蒙古语
const XH="xh";//南非科萨语
const NE="ne";//尼泊尔语
const PA="pa";//旁遮普语
const PS="ps";//普什图语
const JA="ja";//日语
const ST="st";//塞索托语
const SL="sl";//斯洛文尼亚语
const TE="te";//泰卢固语
const TH="th";//泰语   
const CY="cy";//威尔士语
const UK="uk";//乌克兰语
const ES="es";//西班牙语
const EL="el";//希腊语
const SD="sd";//信德语
const IG="ig";//伊博语
const VI="vi";//越南语
const AR="ar";//阿拉伯语
const AZ="az";//阿塞拜疆语
const ET="et";//爱沙尼亚语
const BE="be";//白俄罗斯语
const IS="is";//冰岛语
const BS="bs";//波斯尼亚语    
const AF="af";//布尔语(南非荷兰语)
const DE="de";//德语
const FR="fr";//法语
const FI="fi";//芬兰语
const GU="gu";//古吉拉特语
const HA="ha";//豪萨语
const KY="ky";//吉尔吉斯语
const CA="ca";//加泰罗尼亚语
const KN="kn";//卡纳达语
const HR="hr";//克罗地亚语
const LO="lo";//老挝语
const LB="lb";//卢森堡语
const MR="mr";//马拉地语
const MS="ms";//马来语 
const MI="mi";//毛利语
const ZU="zu";//南非祖鲁语 
const NO="no";//挪威语
const PT="pt";//葡萄牙语
const SV="sv";//瑞典语
const SR="sr";//塞尔维亚语
const SI="si";//僧伽罗语
const SK="sk";//斯洛伐克语
const SW="sw";//斯瓦希里语
const TG="tg";//塔吉克语
const TA="ta";//泰米尔语
const TR="tr";//土耳其语
const UR="ur";//乌尔都语
const UZ="uz";//乌兹别克语
const IW="iw";//希伯来语
const HAW="haw";//夏威夷语
const HU="hu";//匈牙利语 
const HY="hy";//亚美尼亚语
const IT="it";//意大利语
const HI="hi";//印地语
const ID="id";//印尼语
const YO="yo";//约鲁巴语
const ZH_TW="zh-TW";//中文繁体
const ZH_CN="zh-CN";//中文
const EN="en";//英语
          

const DEFAULT_JSON_PATH = './localstring/string_en.json';
const JSON_PATH_MAP = {
    [EN]: DEFAULT_JSON_PATH,
    [SQ]:'./localstring/string_sq.json',//阿尔巴尼亚语
    [AM]:'./localstring/string_am.json',//阿姆哈拉语
    [GA]:'./localstring/string_ga.json', //爱尔兰语
    [EU]:'./localstring/string_eu.json', //巴斯克语
    [BG]:'./localstring/string_bg.json',//保加利亚语
    [PL]:'./localstring/string_pl.json',//波兰语
    [FA]:'./localstring/string_fa.json',//波斯语
    [DA]:'./localstring/string_da.json',//丹麦语
    [RU]:'./localstring/string_ru.json',//俄语
    [TL]:'./localstring/string_tl.json',//菲律宾语
    [FY]:'./localstring/string_fy.json',//弗里西语
    [KA]:'./localstring/string_ka.json',//格鲁吉亚语
    [KK]:'./localstring/string_kk.json',//哈萨克语
    [KO]:'./localstring/string_ko.json',//韩语        
    [NL]:'./localstring/string_nl.json',//荷兰语
    [GL]:'./localstring/string_gl.json',//加利西亚语
    [CS]:'./localstring/string_cs.json',//捷克语
    [CO]:'./localstring/string_co.json',//科西嘉语
    [KU]:'./localstring/string_ku.json',//库尔德语
    [LV]:'./localstring/string_lv.json',//拉脱维亚语
    [LT]:'./localstring/string_lt.json',//立陶宛语 
    [RO]:'./localstring/string_ro.json',//罗马尼亚语
    [MT]:'./localstring/string_mt.json',//马耳他语
    [ML]:'./localstring/string_ml.json',//马拉雅拉姆语
    [MK]:'./localstring/string_mk.json',//马其顿语
    [MN]:'./localstring/string_mn.json',//蒙古语
    [XH]:'./localstring/string_xh.json',//南非科萨语
    [NE]:'./localstring/string_ne.json',//尼泊尔语
    [PA]:'./localstring/string_pa.json',//旁遮普语
    [PS]:'./localstring/string_ps.json',//普什图语
    [JA]:'./localstring/string_ja.json',//日语
    [ST]:'./localstring/string_st.json',//塞索托语
    [SL]:'./localstring/string_sl.json',//斯洛文尼亚语
    [TE]:'./localstring/string_te.json',//泰卢固语
    [TH]:'./localstring/string_th.json',//泰语   
    [CY]:'./localstring/string_cy.json',//威尔士语
    [UK]:'./localstring/string_uk.json',//乌克兰语
    [ES]:'./localstring/string_es.json',//西班牙语
    [EL]:'./localstring/string_el.json',//希腊语
    [SD]:'./localstring/string_sd.json',//信德语
    [IG]:'./localstring/string_ig.json',//伊博语
    [VI]:'./localstring/string_vi.json',//越南语
    [AR]:'./localstring/string_ar.json',//阿拉伯语
    [AZ]:'./localstring/string_az.json',//阿塞拜疆语
    [ET]:'./localstring/string_et.json',//爱沙尼亚语
    [BE]:'./localstring/string_be.json',//白俄罗斯语
    [IS]:'./localstring/string_is.json',//冰岛语
    [BS]:'./localstring/string_bs.json',//波斯尼亚语    
    [AF]:'./localstring/string_af.json',//布尔语(南非荷兰语)
    [DE]:'./localstring/string_de.json',//德语
    [FR]:'./localstring/string_fr.json',//法语
    [FI]:'./localstring/string_fi.json',//芬兰语
    [GU]:'./localstring/string_gu.json',//古吉拉特语
    [HA]:'./localstring/string_ha.json',//豪萨语
    [KY]:'./localstring/string_ky.json',//吉尔吉斯语
    [CA]:'./localstring/string_ca.json',//加泰罗尼亚语
    [KN]:'./localstring/string_kn.json',//卡纳达语
    [HR]:'./localstring/string_hr.json',//克罗地亚语
    [LO]:'./localstring/string_lo.json',//老挝语
    [LB]:'./localstring/string_lb.json',//卢森堡语
    [MR]:'./localstring/string_mr.json',//马拉地语
    [MS]:'./localstring/string_ms.json',//马来语 
    [MI]:'./localstring/string_mi.json',//毛利语
    [ZU]:'./localstring/string_zu.json',//南非祖鲁语 
    [NO]:'./localstring/string_no.json',//挪威语
    [PT]:'./localstring/string_pt.json',//葡萄牙语
    [SV]:'./localstring/string_sv.json',//瑞典语
    [SR]:'./localstring/string_sr.json',//塞尔维亚语
    [SI]:'./localstring/string_si.json',//僧伽罗语
    [SK]:'./localstring/string_sk.json',//斯洛伐克语
    [SW]:'./localstring/string_sw.json',//斯瓦希里语
    [TG]:'./localstring/string_tg.json',//塔吉克语
    [TA]:'./localstring/string_ta.json',//泰米尔语
    [TR]:'./localstring/string_tr.json',//土耳其语
    [UR]:'./localstring/string_ur.json',//乌尔都语
    [UZ]:'./localstring/string_uz.json',//乌兹别克语
    [IW]:'./localstring/string_iw.json',//希伯来语
    [HAW]:'./localstring/string_haw.json',//夏威夷语
    [HU]:'./localstring/string_hu.json',//匈牙利语 
    [HY]:'./localstring/string_hy.json',//亚美尼亚语
    [IT]:'./localstring/string_it.json',//意大利语
    [HI]:'./localstring/string_hi.json',//印地语
    [ID]:'./localstring/string_id.json',//印尼语
    [YO]:'./localstring/string_yo.json',//约鲁巴语
    [ZH_TW]:'./localstring/string_tw.json',//中文繁体
    [ZH_CN]:'./localstring/string_cn.json'//中文

};


class Strings {
    constructor(locale = EN) {
        this.setLocale(locale);
    }

    setLocale(locale) {
        this.locale = locale;
        const jsonPath = JSON_PATH_MAP[locale] || DEFAULT_JSON_PATH;
        
        this.strings = require(jsonPath+'');
    }

    translate(str) {
        const templateText = this.strings[str];
        if (!templateText) {
            return str;
        }
        return templateText;
    }
}

module.exports = Strings;
