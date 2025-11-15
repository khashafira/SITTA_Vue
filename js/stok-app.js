const { createApp, ref, reactive, computed, watch } = Vue;

createApp({
  setup() {
     const stok = ref(dataBahanAjar.stok);
     const upbjjList = ref(dataBahanAjar.upbjjList);
     const kategoriList = ref(dataBahanAjar.kategoriList);


    const filter = reactive({ upbjj: "", kategori: "", status: "" });
    const sortBy = ref("");
    const newItem = reactive({
      kode: "", judul: "", kategori: "", upbjj: "",
      lokasiRak: "", qty: 0, safety: 0, harga: 0, catatanHTML: ""
    });
    const pesan = ref("");

    const filteredStok = computed(() => {
      return stok.value.filter(b => {
        let match = true;
        if (filter.upbjj && b.upbjj !== filter.upbjj) match = false;
        if (filter.kategori && b.kategori !== filter.kategori) match = false;
        if (filter.status === "low" && !(b.qty < b.safety && b.qty > 0)) match = false;
        if (filter.status === "empty" && b.qty !== 0) match = false;
        return match;
      });
    });

    const sortedFilteredStok = computed(() => {
      const data = [...filteredStok.value];
      if (sortBy.value === "judul") data.sort((a,b) => a.judul.localeCompare(b.judul));
      if (sortBy.value === "qty") data.sort((a,b) => a.qty - b.qty);
      if (sortBy.value === "harga") data.sort((a,b) => a.harga - b.harga);
      return data;
    });

    const resetFilter = () => {
      filter.upbjj = filter.kategori = filter.status = "";
      sortBy.value = "";
    };

    const updateQty = (item, event) => {
      const val = parseInt(event.target.textContent);
      if (!isNaN(val)) item.qty = val;
    };

    const addItem = () => {
      if (!newItem.kode || !newItem.judul) {
        pesan.value = "❌ Isi minimal Kode dan Judul!";
        return;
      }
      stok.value.push({ ...newItem });
      Object.keys(newItem).forEach(k => newItem[k] = "");
      pesan.value = "✅ Data berhasil ditambahkan!";
      setTimeout(() => pesan.value = "", 2000);
    };

    // Watchers
    watch(() => filter.upbjj, () => console.log("Filter daerah berubah:", filter.upbjj));
    watch(stok, () => console.log("Perubahan stok terdeteksi"), { deep: true });

    return { stok, upbjjList, kategoriList, filter, sortBy, resetFilter, sortedFilteredStok, newItem, addItem, pesan, updateQty };
  }
}).mount("#stokApp");
