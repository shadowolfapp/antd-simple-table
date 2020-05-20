import { Tag } from "antd";
import moment from "moment";
import React from "react";

import getTagColor from "./getTagColor";

import { ValueType } from "../enums/ValueType";
import {
  MoneyValueObjectType,
  NumberValueObjectType,
  PercentValueObjectType,
  TagValueObjectType,
  ValueObjectType,
} from "../interfaces/ValueObjectType";
import { ValueTypeFunction } from "../interfaces/ValueTypeFunction";

const renderTextByObject = <T, U>(
  text: string | number | React.ReactText[],
  value: ValueObjectType<T>,
  index: number,
  item?: T
): React.ReactNode => {
  switch (value.type) {
    case ValueType.PERCENT: {
      const {
        showSymbol = true,
        precision = 2,
        useGrouping = false,
      } = value as PercentValueObjectType;
      const tempText = Number(text);
      const percentText = new Intl.NumberFormat(window.navigator.language, {
        style: "percent",
        useGrouping,
        maximumFractionDigits: precision,
        minimumFractionDigits: precision,
      }).format(showSymbol ? tempText : Math.abs(tempText));
      return `${showSymbol ? "+" : ""}${percentText}`;
    }

    case ValueType.MONEY: {
      const { currency, useGrouping = true } = value as MoneyValueObjectType;
      return new Intl.NumberFormat(window.navigator.language, {
        style: "currency",
        currency,
        useGrouping,
      }).format(Number(text));
    }

    case ValueType.NUMBER: {
      const {
        useGrouping = false,
        precision = 3,
      } = value as NumberValueObjectType;
      return new Intl.NumberFormat(window.navigator.language, {
        style: "decimal",
        useGrouping,
        maximumFractionDigits: precision,
        minimumFractionDigits: precision,
      }).format(Number(text));
    }

    case ValueType.TAG: {
      const { onClick } = value as TagValueObjectType<T>;
      if (typeof text === "object") {
        return text.map((textItem, tagIndex) => {
          if (textItem) {
            return (
              <Tag
                color={getTagColor(`${textItem}`)}
                key={textItem}
                style={{ marginBottom: 8, cursor: "pointer" }}
                onClick={() => {
                  onClick([String(textItem), tagIndex], text, item, index);
                }}
              >
                {textItem}
              </Tag>
            );
          }
          return null;
        });
      }
      return null;
    }

    default:
      return text;
  }
};

/**
 * 根据不同的类型来转化数值
 * @param text
 * @param valueType
 */
const renderText = <T, U>(
  text: string | number | React.ReactText[],
  valueType: ValueType | ValueTypeFunction<T> | ValueObjectType<T>,
  index: number,
  item?: T
): React.ReactNode => {
  if (text !== null && text !== undefined) {
    if (typeof valueType === "function" && item) {
      const value = valueType(text, item, index);
      if (typeof value === "string") {
        return renderText(text, valueType, index);
      }
      if (typeof value === "object") {
        return renderTextByObject(text, value, index, item);
      }
    }

    if (typeof valueType === "object") {
      return renderTextByObject(text, valueType, index, item);
    }

    switch (valueType) {
      /**
       *如果是日期的值
       */
      case ValueType.DATE: {
        return moment(text).format("YYYY-MM-DD");
      }

      /**
       *如果是日期加时间类型的值
       */
      case ValueType.DATE_TIME: {
        return moment(text).format("YYYY-MM-DD HH:mm:ss");
      }

      /**
       *如果是时间类型的值
       */
      case ValueType.TIME: {
        return moment(text).format("HH:mm:ss");
      }

      case ValueType.INDEX: {
        return index + 1;
      }
      /**
       * 百分比
       */
      case ValueType.PERCENT: {
        return new Intl.NumberFormat(window.navigator.language, {
          style: "percent",
          useGrouping: false,
          maximumFractionDigits: 20,
        }).format(Number(text));
      }

      /**
       * 数字
       */
      case ValueType.NUMBER: {
        return new Intl.NumberFormat(window.navigator.language, {
          style: "decimal",
          useGrouping: false,
          maximumFractionDigits: 20,
        }).format(Number(text));
      }

      /**
       * 标签
       */
      case ValueType.TAG: {
        if (typeof text === "object") {
          return text.map((value) =>
            value ? (
              <Tag
                color={getTagColor(String(value))}
                key={value}
                style={{ marginBottom: 8, cursor: "pointer" }}
              >
                {value}
              </Tag>
            ) : null
          );
        }
        return null;
      }

      default:
        return text;
    }
  } else {
    return null;
  }
};

export default renderText;