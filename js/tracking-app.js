const { createApp, ref, reactive, computed, watch } = Vue;

createApp({
  setup() {
    // Ambil data dummy dari file dataBahanAjar.js
    const dataTracking = dataBahanAjar.tracking;
    const pengirimanList = ref(dataBahanAjar.pengirimanList);
    const paketList = ref(dataBahanAjar.paket);



    // Form tambah DO
    const newDO = reactive({
      nim: "",
      nama: "",
      ekspedisi: "",
      paket: "",
      tanggalKirim: "",
    });

    const selectedPaket = ref("");
    const pesan = ref("");
    const hasil = ref(null);
    const nomorDO = ref("");
    const tidakAda = ref(false);

    // Computed untuk detail paket
    const detailPaket = computed(() => {
      return paketList.value.find(p => p.kode === selectedPaket.value);
    });

    // Generate nomor DO otomatis
    const generateNomorDO = () => {
      const existing = Object.keys(dataTracking);
      const tahun = new Date().getFullYear();
      const nextNumber = String(existing.length + 1).padStart(4, "0");
      return `DO${tahun}-${nextNumber}`;
    };

    // Tambah DO baru
    const tambahDO = () => {
      if (!newDO.nim || !newDO.nama || !selectedPaket.value || !newDO.ekspedisi) {
        pesan.value = "❌ Mohon isi semua field dengan benar.";
        return;
      }

      const kode = generateNomorDO();
      const paket = detailPaket.value;

      dataTracking[kode] = {
        nim: newDO.nim,
        nama: newDO.nama,
        status: "Dalam Perjalanan",
        ekspedisi: newDO.ekspedisi,
        tanggalKirim: newDO.tanggalKirim || new Date().toISOString().split("T")[0],
        paket: paket.nama,
        total: paket.harga,
        perjalanan: [
          { waktu: new Date().toLocaleString(), keterangan: "Pesanan diproses di gudang UT" },
        ],
      };

      pesan.value = `✅ DO berhasil ditambahkan dengan nomor ${kode}`;
      Object.keys(newDO).forEach(k => newDO[k] = "");
      selectedPaket.value = "";
      setTimeout(() => pesan.value = "", 3000);
    };

    // Cek Tracking
    const cekTracking = () => {
      if (dataTracking[nomorDO.value]) {
        hasil.value = dataTracking[nomorDO.value];
        tidakAda.value = false;
      } else {
        hasil.value = null;
        tidakAda.value = true;
      }
    };

    // Watchers
    watch(selectedPaket, (val) => {
      if (val) console.log("Paket dipilih:", val);
    });

    return {
      pengirimanList,
      paketList,
      selectedPaket,
      newDO,
      detailPaket,
      tambahDO,
      pesan,
      hasil,
      nomorDO,
      tidakAda,
      cekTracking
    };
  }
}).mount("#trackingApp");
