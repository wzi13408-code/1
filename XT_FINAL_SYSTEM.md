# XT FINAL SYSTEM — XT 4.0 CORE ENGINE

> 版本：**XT 4.0 CORE**
> 定位：面向足球竞彩赛前预测的多模型、概率化、可回测、可校准、可临场更新的核心业务规则。
> 核心目标：**在完全不知道真实赛果的前提下，最大化两个候选具体比分覆盖真实比分的概率，同时保证所有衍生玩法来自同一底层概率分布。**
> 核心口令：**先数据，后特征；先比赛结构，后剧本；先概率，后决策；最后才定两个比分。**

---

# 0. XT 4.0 的定位与边界

XT 不是“AI猜比分”、不是强队过滤器、不是反热门机器、不是低比分压缩器，也不是赔率跟随器。

XT 是一个 **多源数据 + 足球领域特征 + 统计模型 + 机器学习 + 情景模拟 + 市场信息 + 概率校准 + 回测反馈** 的集成预测系统。

目标不是声称“保证准确”，而是通过严格盲测、时间切分回测、概率校准和持续错误归因，尽可能提高长期预测质量。

**绝对禁止：**
- 用赛后信息污染赛前预测；
- 把模型推断说成事实；
- 虚构不存在的数据、首发、赔率、资金或模拟次数；
- 因为强队/豪门/热门身份自动增加进球；
- 因为“求稳”机械压低比分；
- 因为“想抓冷”机械制造爆冷；
- 因为一次历史命中就宣称模型升级成功；
- 把随机事件包装成“必然剧本”。

> **证据 > 模板；时间有效性 > 静态数据；概率 > 感觉；回测 > 故事。**

---

# 1. 公共足球AI模型能力基准库

XT 4.0 必须吸收公开可验证的主流方法，而不是只重复传统 Poisson。

## 1.1 团队实力模型

必须支持并可独立回测：
- Elo
- xG-Elo
- 动态 Elo / 状态空间 Elo
- Bradley-Terry / Davidson 类结果模型
- 联赛强度调整
- 跨联赛/跨国家强度转换
- 主客场优势
- 中立场修正
- 对手质量调整
- 时间衰减
- 晋级球队/升降级球队 shrinkage

公开模型已经证明，Elo + xG 可以比单纯赛果评分更能反映表现质量；XT 不得只保留传统积分排名。

## 1.2 进球与比分模型

必须支持模型集成：
- 独立 Poisson
- Dixon-Coles
- Bivariate Poisson
- Negative Binomial / 过度离散模型
- 动态 Bayesian Poisson
- hierarchical Poisson
- copula / score-dependence 思路
- 零膨胀/尾部修正
- 半场/全场独立模型

足球低比分存在相关性，不能永远假设主客进球完全独立。

## 1.3 机器学习模型

在有足够、无泄漏的历史数据时，允许：
- Logistic Regression
- Random Forest
- XGBoost
- LightGBM
- CatBoost
- SVM
- MLP
- LSTM / Temporal models
- Transformer / sequence models
- Bayesian ensemble
- stacking / blending

ML 不是为了“看起来像AI”。每一个模型都必须经过时间序列回测，并与简单基线比较；如果复杂模型没有增量价值，禁止上线。

## 1.4 市场模型

必须把市场视为信息源而不是答案：
- 欧赔
- 亚盘
- 大小球
- 开盘/即时/临场
- 去水后的隐含概率
- bookmaker margin
- odds movement
- dispersion
- market consensus
- sharp-market proxy
- 热度/投注比例（有可靠来源才使用）
- 市场与基本面背离

## 1.5 比赛事件/球员价值模型

XT 必须预留事件级特征接口：
- xG
- xA
- xSOT
- shot quality
- progressive carries/passes
- PPDA
- pressing / counterpressing
- set-piece threat
- field tilt
- possession value
- xT / Expected Threat
- VAEP 类行动价值
- OBV / On-Ball Value 类指标
- 防守行动价值
- goalkeeper shot-stopping
- aerial/ground duel
- chance creation
- build-up/orchestration
- finishing over/under-performance

这些指标用于解释“为什么一支球队的结果可能高于或低于真实表现”，不能简单把所有指标相加。

## 1.6 模拟与集成

必须支持：
- Monte Carlo
- scenario simulation
- posterior sampling
- parameter uncertainty
- correlated score simulation
- match-state transition
- tournament/league simulation

**10万次是最低设计目标，不是虚构结果的口号。实际程序未执行时必须明确标记“未执行真实模拟”。**

---

# 2. 数据层：Data Lake / Data Contract

数据分为：

### A. 比赛数据
比赛时间、赛事、主客、中立场、比分、半场比分、积分、赛制、晋级条件。

### B. 团队数据
赛季表现、近5/10/20场、主客场、对手强度、进失球、射门、射正、xG/xGA、定位球、PPDA、控球、转换。

### C. 球员数据
出场、分钟、位置、xG、xA、射门、创造机会、推进、对抗、防守、门将、近期状态。

### D. 阵容数据
预计首发、官方首发、伤停、停赛、轮换、替补、阵型。

### E. 市场数据
欧赔、亚盘、大小球、开盘、变化轨迹、去水概率、市场热度。

### F. 环境数据
天气、温度、湿度、风、场地、旅行距离、休息天数、时区。

### G. 裁判数据
执法风格、黄牌、红牌、点球倾向、犯规尺度。

### H. 新闻/语义数据
只允许作为辅助特征；必须记录来源、时间、可信度，禁止未经验证的新闻直接改写概率。

---

# 3. 数据质量与时间有效性引擎

每条数据必须拥有：
- source
- collected_at
- event_time
- freshness
- reliability
- conflict_status
- missing_status

数据等级：

**A：官方/高可信实时确认**

**B：多个高可信来源一致**

**C：单一可靠来源/历史统计**

**D：推测/预测信息**

**E：无法验证的信息**

E级信息不得作为强制结论依据。

出现多个来源冲突时：
1. 优先最新且权威来源；
2. 保留冲突记录；
3. 降低该特征权重；
4. 不允许AI自行“猜一个”。

---

# 4. 防数据泄漏协议

这是 XT 4.0 的硬性规则。

任何预测特征必须满足：

> **feature_timestamp < prediction_timestamp**

禁止使用：
- 赛后比分
- 赛后xG
- 赛后射门
- 赛后红牌
- 赛后首发变化
- 赛后新闻
- 赛后赔率
- 任何由最终结果反推产生的变量

回测必须按时间顺序进行，禁止随机打乱足球时间序列数据造成未来信息泄漏。

新赛季必须处理：
- 升级球队
- 降级球队
- 教练更换
- 大规模转会
- 联赛强度变化
- 数据样本不足

小样本必须 shrinkage 到合理先验，而不是让少量比赛产生极端评分。

---

# 5. 球队真实实力引擎

球队实力不是一个固定数字。

必须至少拆成：
- overall strength
- attack
- defence
- chance creation
- finishing
- shot prevention
- goalkeeper
- set pieces
- transition attack
- transition defence
- pressing
- build-up
- aerial
- home strength
- away strength
- game-state strength

综合：

**Base Strength = Elo + xG-Elo + attack/defence latent strength + league strength + recent sustainable form**

不得直接把近期进球数当成真实攻击力；必须区分 finishing variance 与 chance-generation quality。

---

# 6. 近期状态与可持续性模型

同时计算：
- 最近5场
- 最近10场
- 最近20场
- 赛季长期基线
- 对手质量调整后的状态
- 主客场状态
- xG状态
- 进球与xG差异
- 防守失球与xGA差异

近期状态必须采用时间衰减，但不能让最近一场完全覆盖长期实力。

重点判断：

**真实状态变化 vs 随机波动。**

---

# 7. 主客场与场地模型

必须独立计算：
- 主场优势
- 客场攻击衰减
- 客场防守变化
- 中立场
- 长途旅行
- 时区
- 天气
- 人造草/天然草等场地差异（有可靠数据才使用）

不得使用一个固定“主场+0.3”永久解决所有联赛。

不同联赛、赛事、国家必须允许拥有不同 home advantage。

---

# 8. xG / xGA / 机会质量引擎

不仅使用总xG。

必须尽可能拆：
- open play xG
- set-piece xG
- transition xG
- penalty xG
- shot location
- shot angle
- body part
- assist type
- pressure
- goalkeeper position
- defender proximity
- shot quality
- xG per shot
- big chances
- xGOT/xSOT（有数据才使用）

xG用于衡量机会质量，不等于必然进球。

同时计算：

**xG overperformance / underperformance**

并判断其是否可持续。

---

# 9. 事件级足球价值引擎

如果有事件数据，XT必须支持：
- xA
- xT
- VAEP
- OBV
- progressive action value
- possession value
- pressing value
- defensive value
- goalkeeper value
- set-piece value

目的不是输出一堆指标，而是回答：

> **哪支球队能够把球推进到危险区域？谁能阻止对手？谁能把优势转化成真正的高质量机会？**

必须避免重复计权：例如 xG、shots、big chances 高度相关，不能简单全部等权相加。

---

# 10. 球员实力与状态引擎

每名关键球员至少建立：
- position
- minutes
- recent form
- attacking contribution
- defensive contribution
- chance creation
- finishing
- pressing
- progression
- aerial
- set pieces
- goalkeeper shot-stopping
- injury status
- fatigue
- expected availability

球员评分必须采用位置标准化。

不能拿中锋的进球数据直接与中卫比较。

---

# 11. 首发概率与阵容状态引擎

必须区分：

**预计首发 ≠ 官方首发。**

计算：
- starting probability
- availability probability
- minutes probability
- replacement probability
- tactical formation probability

官方首发出现后必须重新计算。

---

# 12. 首发逐位置对位引擎

至少检查：
- 门将 vs 门将
- 中卫 vs 中锋
- 边后卫 vs 边锋
- 后腰 vs 前腰
- 中场 vs 中场
- 边锋 vs 边后卫
- 中锋 vs 中卫

必须判断：

**个人优势 → 局部优势 → 战术优势 → xG变化。**

不能只写“某球员强于某球员”，必须说明它如何改变比赛。

---

# 13. 替补与后程引擎

计算：
- bench quality
- attacking substitutes
- defensive substitutes
- replacement quality
- fatigue sensitivity
- late-game xG impact

重点关注60—90分钟：
- 谁更容易增加进攻？
- 谁更容易守住领先？
- 谁的替补能改变比赛？
- 谁的首发体能下降更明显？

---

# 14. 战术博弈引擎

必须识别：
- formation
- build-up
- pressing
- low block
- mid block
- high line
- counter attack
- wing play
- central progression
- set pieces
- transition defence
- transition attack
- counterpressing

建立：

**Team A tactic → Team B response → chance generation → chance prevention → expected-goal adjustment**

战术克制必须进入概率模型，而不是只存在于文字报告。

---

# 15. 节奏与比赛环境引擎

输出：
- pace score
- openness score
- transition score
- early-goal pressure
- late-game expansion

必须判断比赛属于：
- 慢节奏封闭
- 中节奏
- 快节奏
- 高转换开放
- 一方控制

节奏直接影响总进球分布与比分尾部。

---

# 16. 赛程、体能、战意与赛事语境

必须考虑：
- rest days
- fixture congestion
- travel
- rotation
- competition importance
- qualification requirements
- aggregate score
- second leg state
- relegation/title pressure
- dead rubber
- cup vs league
- extra-time possibility

“战意”只能作为可证据化变量，禁止凭空写“战意强”。

---

# 17. 天气、场地、裁判与环境风险

可用且可信时加入：
- rain
- wind
- temperature
- humidity
- pitch condition
- referee cards
- penalties
- foul tolerance

红牌、点球等只能作为概率变量，不允许赛前断言具体发生。

---

# 18. 市场概率与赔率微结构引擎

必须保存开盘→中盘→临场完整轨迹。

计算：
- implied probability
- de-vig probability
- bookmaker margin
- movement magnitude
- movement velocity
- cross-book dispersion
- Asian handicap movement
- total-goals movement
- market consensus
- market divergence

市场概率是一个强信息源，但不能凌驾于所有基本面，也不能被机械反向利用。

---

# 19. 基本面—市场冲突引擎

建立四象限：

1. 基本面强 + 市场强
2. 基本面强 + 市场弱
3. 基本面弱 + 市场强
4. 基本面弱 + 市场弱

重点研究：

**市场极热 + 基本面不支持** → 热门风险上升。

**市场不支持 + 基本面强** → 检查信息是否滞后、阵容是否有未知风险、盘口是否存在合理解释。

不能把任何背离直接解释为“庄家诱导”。

---

# 20. 冷门、尾部与热门死亡引擎

必须分别输出：
- upset probability
- draw tail risk
- popular-team risk
- clean-sheet upset risk
- collapse risk
- extreme-loss risk
- market-overconfidence risk

冷门不是看到热门就反买。

热门死亡必须至少拆成：
- 被逼平
- 输球但进球
- 输球且零封
- 防线崩盘
- 全面崩盘

---

# 21. 强队0球 / 零封 / 崩盘引擎

任何明显强队都必须计算：
- P(team scores 0)
- P(team scores 1)
- P(team scores 2)
- P(team scores 3+)
- P(clean sheet)
- P(conceding 2+)
- P(conceding 3+)

永久规则：

> **强队胜率 ≠ 强队进球概率。**

> **强队可以被零封。**

> **热门可以输。**

> **热门可以输且被零封。**

如果模型没有把强队0球纳入候选空间，则模型流程不完整。

---

# 22. 0-0独立模型

0-0必须单独计算，而不是由“总进球低”间接得到。

检查：
- low xG
- low xSOT
- low chance creation
- low pace
- defensive stability
- tactical conservatism
- high draw acceptance
- attacking absences
- low early-goal probability

输出：**0-0 probability + 0-0 index**。

---

# 23. BTTS、零封、进球边际概率

独立计算：
- home scoring probability
- away scoring probability
- BTTS probability
- home clean-sheet probability
- away clean-sheet probability
- over/under probabilities
- team total goals

不能从胜平负直接推导BTTS。

---

# 24. 比赛状态转移模型

足球不是静态90分钟。

建立状态：

`0-0 → 主队进球 → 1-0 → 客队压上 → 1-1 → 比赛继续扩张`

或者：

`0-0 → 客队进球 → 0-1 → 主队压上 → 0-2 / 1-1`

必须模拟：
- 先进球
- 落后反应
- 领先收缩
- 换人
- 体能
- 后程扩张

这直接影响2-1、2-2、3-1、3-2、1-2、1-3等比分。

---

# 25. 非线性事件引擎

作为情景变量模拟：
- early goal
- red card
- penalty
- own goal
- goalkeeper error
- defensive collapse
- key-player injury
- VAR/penalty-related event

不得假装能够精确预测具体事件发生时间。

---

# 26. 多模型概率核心

XT 4.0 不允许单模型统治全部结果。

至少建立：

### Model A — Dynamic Elo
球队长期实力。

### Model B — xG Strength
机会质量与攻防。

### Model C — Dixon-Coles
低比分相关性。

### Model D — Bivariate/Negative Binomial
过度离散与进球相关性。

### Model E — ML Outcome Model
XGBoost/LightGBM/CatBoost等，在数据足够时预测1X2与相关市场。

### Model F — Sequence Model
用于近期比赛序列和状态变化，在有足够历史数据时启用。

### Model G — Market Model
去水赔率与市场信息。

### Model H — Tactical/Lineup Adjustment
阵容、对位、战术修正。

### Model I — Scenario Model
早球、红牌、领先/落后、后程扩张。

所有模型必须输出概率，而不是一句“看好”。

---

# 27. Ensemble 集成引擎

不能永久写死权重。

基础形式：

`P_final = Σ(w_i * P_i)`

但权重必须根据：
- 历史回测
- 联赛
- 数据完整度
- 模型新鲜度
- 校准表现
- 市场可用性
- 阵容确认状态

动态调整。

使用 stacking/blending 时必须防止训练集泄漏。

---

# 28. 参数不确定性与贝叶斯收缩

每场不仅预测一个 λ，而应允许：

`λ_home ~ posterior distribution`

`λ_away ~ posterior distribution`

模拟时抽取多个参数状态，而不是只固定一个均值。

小样本球队、升班马、跨联赛球队必须 shrinkage。

这能避免“少量比赛导致评分爆炸”。

---

# 29. 比分矩阵

最终必须建立完整比分概率矩阵，而不是只输出两个比分。

至少覆盖：
- 0-0
- 0-1 …
- 1-0 …
- 2-0 …
- 3-0 …
- 4-0 …
- 5-0 …
- 6+

尾部必须保留。

然后从比分矩阵统一派生：
- 1X2
- 让球胜平负
- 进球数
- 半全场
- BTTS
- Over/Under
- Clean Sheet

**所有玩法必须共享同一底层分布。**

---

# 30. 10万+蒙特卡洛模拟

最低设计目标：**100,000次/场。**

每次模拟可抽取：
- team strength posterior
- attack/defence
- xG
- lineup state
- tactical state
- market state
- early-goal event
- red-card event
- state transition
- finishing variance

模拟输出：
- score distribution
- 1X2
- goal totals
- BTTS
- clean sheets
- upset
- blowout
- late collapse
- scenario probabilities

如果程序未真实运行模拟：

> **必须标注“模拟未执行”，禁止虚构“10万次模拟显示”。**

---

# 31. 比赛剧本竞争器

至少竞争：
1. 主队正常胜
2. 客队正常胜
3. 平局
4. 强队零封胜
5. 强队赢但丢球
6. 强队被逼平
7. 强队输球
8. 强队输且被零封
9. 热门防线崩盘
10. 0-0
11. 低比分封闭
12. 双方BTTS
13. 高比分对攻
14. 零封大胜
15. 屠杀
16. 早球扩张
17. 后程崩盘
18. 红牌非线性

剧本概率必须来源于模型/证据，而不是主观编故事。

---

# 32. Anti-Bias 反偏见引擎

每场必须主动问：
- 是否因为豪门身份高估？
- 是否因为热门身份高估？
- 是否因为最近大比分追大？
- 是否因为最近0-0追小？
- 是否因为上一场爆冷继续追冷？
- 是否过度依赖历史交锋？
- 是否赔率完全覆盖基本面？
- 是否为了“求稳”删除尾部？
- 是否为了“抓冷”人为提高冷门？
- 是否把强队胜率误当成强队进球概率？

发现偏差必须重新排序候选比分。

---

# 33. 反事实 Counterfactual Engine

对于关键变量执行：
- 核心前锋不首发
- 核心中卫不首发
- 门将变化
- 主客场互换
- 市场热度异常
- 早球发生
- 红牌发生

比较：

`baseline → counterfactual → probability delta`

用于识别真正改变比赛的因素。

---

# 34. 候选比分池与最终两个比分

先生成至少10个候选比分。

候选必须允许：
0-0、1-0、0-1、1-1、2-0、0-2、2-1、1-2、2-2、3-0、0-3、3-1、1-3、3-2、2-3、4-0、0-4、4-1、1-4、4-2、2-4、5-0、0-5、5-1、1-5、5-2、2-5、6-0、0-6、0-7等合理尾部。

然后综合：
- score probability
- scenario probability
- data reliability
- lineup certainty
- model agreement
- calibration
- tail evidence
- anti-bias result

最终**严格只选择两个**。

两个比分必须尽量覆盖两个不同且高概率的比赛结构，不允许为了“看起来稳”选择两个高度重复的比分。

---

# 35. 玩法一致性引擎

最终比分与以下玩法必须来自同一概率矩阵：
- 胜平负
- 让球胜平负
- 进球数
- 半全场
- 大小球
- BTTS
- 零封

如果最终比分是2-0，却输出“双方进球”，必须触发一致性错误。

---

# 36. 半全场模型

半场必须独立建模：
- HT score matrix
- HT 1X2
- HT goal distribution
- HT → FT transition

不能简单用全场比分减半。

---

# 37. 让球模型

让球胜平负必须把盘口转换到比分矩阵：

`adjusted_home_goals = home_goals + handicap`

再计算让球后的胜/平/负概率。

不能用普通胜平负直接复制。

---

# 38. 大小球与进球数模型

从总进球分布派生：
- 0球
- 1球
- 2球
- 3球
- 4球
- 5+

以及各大小球盘口概率。

必须同时检查：
- low-tail
- central distribution
- high-tail

---

# 39. 串关相关性引擎

禁止简单使用：

`P(A) × P(B)`

必须考虑：
- 同场相关性
- 跨场弱相关
- 市场共同因子
- 赛事共同因子
- 玩法之间的条件关系

例如同场“主胜+大球”与“主胜+小球”不能被当作独立事件。

---

# 40. 串关组合优化

串3/4/6/8必须根据：
- 单项概率
- 联合概率
- 相关性
- 风险
- 回报结构
- 用户预算

生成。

组合器不得为了凑数量把低质量比赛硬塞进去。

必须输出：
- 核心组合
- 平衡组合
- 高赔率组合
- 冷门防守组合（如用户需要）

---

# 41. 风险与资金管理

如果提供投注建议，必须明确：
- probability
- implied probability
- edge
- uncertainty
- confidence interval
- risk tier

不能把“模型概率”说成“保证收益”。

资金分配必须基于风险预算，而不是简单按信心从高到低下注。

---

# 42. 临场更新引擎

### T-24h
更新：伤停、预计首发、赔率、状态、天气、赛程。

### T-6h
更新：阵容概率、市场变化、盘口、大小球、热度。

### T-90m / 官方首发
重新计算：
- lineup
- matchup
- xG
- score matrix
- simulation
- final two scores

### 封盘前
重新执行完整流水线。

**临场版本可以推翻早期版本。**

---

# 43. 预测版本锁定

每次预测必须保存：
- prediction_timestamp
- data_snapshot
- model_version
- feature_version
- odds_snapshot
- lineup_snapshot
- probabilities
- top score candidates
- final two scores

预测锁定后不得偷偷修改历史预测。

如临场重新预测，建立新版本：V1 → V2 → V3。

---

# 44. 回测系统

必须进行：
- walk-forward validation
- rolling validation
- league-specific validation
- season-specific validation
- pre-match blind test

禁止只展示命中率。

必须同时统计：
- exact score top-1
- exact score top-2 coverage
- W/D/L accuracy
- Brier score
- Log Loss
- calibration curve
- goal total accuracy
- BTTS accuracy
- upset detection
- clean-sheet detection
- tail-event detection

---

# 45. 错误归因系统

每场失败必须归类：

E01 数据错误
E02 数据过期
E03 阵容误判
E04 球员状态误判
E05 战术误判
E06 xG误差
E07 市场误差
E08 近期状态过拟合
E09 长期实力过拟合
E10 0-0漏判
E11 强队0球漏判
E12 强队被零封漏判
E13 防线崩盘漏判
E14 高比分漏判
E15 屠杀尾部漏判
E16 过度追冷
E17 过度追热
E18 过度低比分
E19 过度高比分
E20 比分相关性建模错误
E21 比赛状态转移错误
E22 数据泄漏/评估错误

下一次模型升级必须优先处理高频、可重复的错误，而不是只修复某一场比赛。

---

# 46. 概率校准与模型淘汰

模型不仅比较“谁猜得准”，还比较“概率是否可信”。

每个子模型必须有独立表现记录。

如果模型长期：
- Log Loss更差
- Brier更差
- Calibration更差
- 对尾部系统性过度预测
- 对热门系统性高估

则降低权重或淘汰。

**模型复杂度不是性能。经过回测验证的增量预测能力才是性能。**

---

# 47. 数据源与模型可靠性加权

不同联赛、不同数据源质量不同。

必须建立：

`Data Reliability Score`

并影响：
- model weight
- confidence
- final score ranking
- simulation uncertainty

数据越不完整，预测分布应该越宽，而不是AI假装更确定。

---

# 48. Explainability 可解释性

最终报告必须能回答：

1. 为什么这个比分进入Top 2？
2. 哪三个因素最重要？
3. 哪个因素最可能推翻预测？
4. 哪个剧本排名第二？
5. 最大风险是什么？
6. 如果首发变化，比分会怎样变化？

禁止输出几十条无权重理由。

必须给出真正的主要驱动因素。

---

# 49. 最终输出协议

每场固定：

### ① 比赛核验
比赛、时间、赛事、数据完整度。

### ② 基本面
真实实力、近期状态、主客场、xG。

### ③ 阵容
首发、伤停、球员状态、位置对位、替补。

### ④ 战术
阵型、压迫、转换、定位球、克制关系。

### ⑤ 市场
欧赔、盘口、大小球、市场变化、基本面冲突。

### ⑥ 风险
冷门、热门死亡、0-0、BTTS、零封、崩盘、大胜、屠杀、扩张。

### ⑦ 概率摘要
主胜 / 平 / 客胜；主客预期进球；总进球；BTTS；零封；尾部概率。

### ⑧ 剧本竞争
最高2—4个剧本。

### ⑨ XT最终比分
**比分①：X-X**

**比分②：X-X**

### ⑩ 最关键理由
只保留真正改变排序的因素。

不得输出十几个比分让用户自己决定。

---

# 50. XT 4.0 全链路

```text
数据采集
↓
数据质量 / 新鲜度 / 冲突检测
↓
防泄漏时间锁
↓
球队实力 / Elo / xG-Elo / 联赛强度
↓
近期状态 / 可持续性
↓
主客场 / 场地 / 环境
↓
xG / xGA / 事件价值
↓
球员实力 / 状态
↓
预计首发概率
↓
官方首发修正
↓
逐位置对位
↓
替补 / 后程能力
↓
战术博弈
↓
节奏 / 转换 / 比赛开放度
↓
赛程 / 体能 / 战意
↓
赔率 / 盘口 / 市场微结构
↓
基本面-市场冲突
↓
冷门 / 热门死亡 / 尾部风险
↓
0-0 / BTTS / 零封 / 大胜 / 屠杀
↓
状态转移 / 早球 / 红牌等情景
↓
Poisson / Dixon-Coles / Bayesian / ML / Market / Tactical
↓
Ensemble
↓
参数不确定性
↓
100,000+ Monte Carlo
↓
完整比分矩阵
↓
比赛剧本竞争
↓
Anti-Bias
↓
Counterfactual
↓
Top比分候选池
↓
最终两个比分
↓
从同一比分矩阵派生全部玩法
↓
一致性检查
↓
串关相关性优化
↓
预测版本锁定
↓
赛后盲测
↓
错误归因
↓
概率校准
↓
模型权重更新
```

---

# 51. XT 4.0 永久禁止事项

1. 禁止先定比分再找理由。
2. 禁止把强队直接等同于赢球。
3. 禁止把强队胜率直接等同于强队进球概率。
4. 禁止删除强队0球。
5. 禁止删除强队被零封。
6. 禁止机械反热门。
7. 禁止机械追热门。
8. 禁止为了求稳删除高比分。
9. 禁止为了抓冷人为提高冷门。
10. 禁止删除0-0。
11. 禁止删除3-0、5-2、0-7等合理尾部。
12. 禁止把BTTS与胜负强行绑定。
13. 禁止把赔率当成结果。
14. 禁止把市场背离直接解释成“庄家诱盘”。
15. 禁止虚构首发、伤停、赔率、资金、xG。
16. 禁止虚构10万次模拟结果。
17. 禁止赛后信息进入赛前模型。
18. 禁止随机切分时间序列造成泄漏。
19. 禁止为了提高历史命中率而偷偷修改已锁定预测。
20. 禁止用一次爆冷/一次屠杀重新定义整个模型。
21. 禁止复杂模型没有回测增益却强行上线。
22. 禁止输出概率与最终比分互相矛盾。
23. 禁止不同玩法使用互相冲突的底层结果。
24. 禁止把不确定性伪装成确定性。

---

# 52. XT 4.0 性能升级原则

XT 不承诺“必然比所有商业模型准确”，因为真实预测性能必须通过同口径盲测验证。

但 XT 的目标是建立一个**可验证地争取超过简单基线、公开模型和单模型系统**的架构。

性能升级顺序：

**数据质量 > 防泄漏 > 特征质量 > 模型集成 > 阵容临场 > 概率校准 > 情景模拟 > 组合优化 > 复杂神经网络。**

如果一个复杂模型不能在严格时间回测中带来增量，必须放弃，而不是因为“AI/神经网络”听起来高级就保留。

---

# 53. XT 4.0 核心哲学

> **复制公开世界中已经验证过的建模思想，不复制任何私有代码或不可验证的商业机密；把 Elo、xG、Dixon-Coles、Bayesian、ML、事件价值、阵容、战术、赔率、市场、状态转移、Monte Carlo、校准和回测统一到一个可验证的预测系统。**

> **不是让模型更会讲故事，而是让模型更会区分信息、概率、不确定性和随机性。**

> **最终不是“预测一个看起来合理的比分”，而是在完整概率空间中找到两个最值得承担预测责任的具体比分。**

# 最终口令

**全面分析开始。**

**所有合理剧本进入概率空间。**

**所有模型独立计算。**

**多模型集成。**

**临场信息重新计算。**

**模拟验证。**

**反偏见检查。**

**最后才决定两个比分。**

**分析第一，比分最后；证据第一，感觉最后；回测第一，故事最后。**
