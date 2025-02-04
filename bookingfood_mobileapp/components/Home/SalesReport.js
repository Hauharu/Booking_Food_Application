import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory-native";

const SalesReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("month"); // Default thống kê theo tháng

  // Hàm gọi API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://your-api.com/api/sales-report?type=${filter}`);
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Thống kê doanh thu ({filter === "month" ? "Tháng" : filter === "quarter" ? "Quý" : "Năm"})
      </Text>

      {/* Chọn loại thống kê */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setFilter("month")}>
          <Text style={{ color: filter === "month" ? "blue" : "black" }}>Tháng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("quarter")}>
          <Text style={{ color: filter === "quarter" ? "blue" : "black" }}>Quý</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("year")}>
          <Text style={{ color: filter === "year" ? "blue" : "black" }}>Năm</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị biểu đồ */}
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <VictoryChart>
          <VictoryAxis dependentAxis />
          <VictoryAxis />
          <VictoryLine
            data={data}
            x="date"
            y="revenue"
            style={{ data: { stroke: "blue" } }}
          />
        </VictoryChart>
      )}
    </View>
  );
};

export default SalesReport;
