import React from "react";
import { motion } from "framer-motion";
import { Thermometer, Wind, Droplets, Eye, MapPin, Clock } from "lucide-react";
import { PremiumWeatherCardProps, DEFAULT_PROPS } from './PremiumWeatherCard.constants';
import { styles, buildCardStyle, getMetricIconColor } from './PremiumWeatherCard.styles';
import { usePremiumWeatherCard, useWeatherCardAnimations } from './PremiumWeatherCard.hooks';
import WeatherIcon from './components/WeatherIcon';
import WeatherSkeleton from './components/WeatherSkeleton';

const PremiumWeatherCard: React.FC<PremiumWeatherCardProps> = ({
  weather,
  airQuality,
  alerts = DEFAULT_PROPS.alerts!,
  isLoading = DEFAULT_PROPS.isLoading!,
  className = DEFAULT_PROPS.className!,
  locationName = DEFAULT_PROPS.locationName!,
}) => {
  // Custom hooks for logic and animations
  const {
    currentAQI,
    aqiInfo,
    temp,
    feelsLike,
    isDay,
    localTime,
    condition,
    description,
    metrics
  } = usePremiumWeatherCard(weather, airQuality);

  const {
    cardAnimation,
    temperatureAnimation,
    metricAnimation,
    iconAnimation,
    particleAnimations,
    alertAnimation
  } = useWeatherCardAnimations();

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={cardAnimation.initial}
        animate={cardAnimation.animate}
        className={styles.card({ className, isLoading })}
        style={buildCardStyle()}
      >
        <WeatherSkeleton />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={cardAnimation.initial}
      animate={cardAnimation.animate}
      whileHover={cardAnimation.whileHover}
      transition={cardAnimation.transition}
      className={styles.card({ className })}
      style={buildCardStyle()}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className={styles.backgroundElement({ position: 'top-right', size: 'large' })}></div>
        <div className={styles.backgroundElement({ position: 'bottom-left', size: 'medium' })}></div>

        {/* Floating particles */}
        <motion.div
          animate={particleAnimations.primary.animate}
          transition={particleAnimations.primary.transition}
          className={styles.particle('primary')}
        />
        <motion.div
          animate={particleAnimations.secondary.animate}
          transition={particleAnimations.secondary.transition}
          className={styles.particle('secondary')}
        />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header with location and time */}
        <div className={styles.header}>
          <div className={styles.locationContainer}>
            <div className={styles.locationText}>
              <MapPin className="w-4 h-4" />
              <span className={styles.locationName}>
                {locationName || weather?.name || "Loading..."}
              </span>
            </div>
            <div className={styles.timeText}>
              <Clock className="w-3 h-3" />
              <span>{localTime}</span>
            </div>
          </div>

          <motion.div
            animate={iconAnimation.animate}
            transition={iconAnimation.transition}
            className={styles.iconContainer}
          >
            <WeatherIcon condition={condition} isDay={isDay} />
          </motion.div>
        </div>

        {/* Main temperature display */}
        <div className={styles.temperatureSection}>
          <div className={styles.temperatureContainer}>
            <motion.div
              initial={temperatureAnimation.initial}
              animate={temperatureAnimation.animate}
              transition={temperatureAnimation.transition}
              className={styles.mainTemperature}
            >
              {temp}°
            </motion.div>
            <div className={styles.feelsLike}>feels {feelsLike}°</div>
          </div>

          <div className={styles.description}>{description}</div>
        </div>

        {/* Weather metrics grid */}
        <div className={styles.metricsGrid}>
          <motion.div
            whileHover={metricAnimation.whileHover}
            transition={metricAnimation.transition}
            className={styles.metricCard()}
          >
            <div className={styles.metricHeader}>
              <Droplets className={`w-5 h-5 ${getMetricIconColor('humidity')}`} />
              <span className={styles.metricLabel}>Humidity</span>
            </div>
            <div className={styles.metricValue}>{metrics.humidity}%</div>
          </motion.div>

          <motion.div
            whileHover={metricAnimation.whileHover}
            transition={metricAnimation.transition}
            className={styles.metricCard()}
          >
            <div className={styles.metricHeader}>
              <Wind className={`w-5 h-5 ${getMetricIconColor('wind')}`} />
              <span className={styles.metricLabel}>Wind</span>
            </div>
            <div className={styles.metricValue}>{metrics.windSpeed} km/h</div>
          </motion.div>

          <motion.div
            whileHover={metricAnimation.whileHover}
            transition={metricAnimation.transition}
            className={styles.metricCard()}
          >
            <div className={styles.metricHeader}>
              <Thermometer className={`w-5 h-5 ${getMetricIconColor('pressure')}`} />
              <span className={styles.metricLabel}>Pressure</span>
            </div>
            <div className={styles.metricValue}>{metrics.pressure} hPa</div>
          </motion.div>

          <motion.div
            whileHover={metricAnimation.whileHover}
            transition={metricAnimation.transition}
            className={styles.metricCard()}
          >
            <div className={styles.metricHeader}>
              <Eye className={`w-5 h-5 ${getMetricIconColor('visibility')}`} />
              <span className={styles.metricLabel}>Visibility</span>
            </div>
            <div className={styles.metricValue}>{metrics.visibility}</div>
          </motion.div>
        </div>

        {/* Air Quality Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={styles.airQuality({ aqiColor: aqiInfo?.color || 'emerald', bgGradient: aqiInfo?.bgColor || 'from-emerald-400/20 to-emerald-600/20' })}
        >
          <div className={styles.airQualityHeader}>
            <span className={styles.airQualityLabel}>Air Quality</span>
            <span className={styles.airQualityBadge(aqiInfo?.color || 'emerald')}>
              {aqiInfo?.label || 'Good'}
            </span>
          </div>
          <div className={styles.airQualityValue}>AQI {currentAQI}</div>
        </motion.div>

        {/* Alerts section */}
        {alerts && alerts.length > 0 && (
          <motion.div
            initial={alertAnimation.initial}
            animate={alertAnimation.animate}
            transition={alertAnimation.transition}
            className={styles.alertsContainer}
          >
            {alerts.slice(0, 2).map((alert, index) => (
              <div key={index} className={styles.alert()}>
                <div className={styles.alertContent}>
                  <div className={styles.alertIcon()}>
                    <span className="text-xs">⚠</span>
                  </div>
                  <div className="min-w-0">
                    <p className={styles.alertMessage}>{alert.message}</p>
                    {"affectedActivities" in alert && alert.affectedActivities && (
                      <div className={styles.alertActivities}>
                        {alert.affectedActivities.slice(0, 3).map((activity) => (
                          <span key={activity} className={styles.alertActivity()}>
                            {activity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Hover glow effect */}
      <div className={styles.hoverGlow}>
        <div className={styles.hoverGlowGradient}></div>
      </div>
    </motion.div>
  );
};

export default PremiumWeatherCard;