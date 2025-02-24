"use client";
import { Field } from "@/lib/components/form/Field";
import { FormBetter } from "@/lib/components/form/FormBetter";
import { Alert } from "@/lib/components/ui/alert";
import { BreadcrumbBetterLink } from "@/lib/components/ui/breadcrumb-link";
import { ButtonContainer } from "@/lib/components/ui/button";
import { apix } from "@/lib/utils/apix";
import { labelDocumentType } from "@/lib/utils/document_type";
import { events } from "@/lib/utils/event";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { IoMdSave } from "react-icons/io";

function Page() {
  const labelPage = "Template";
  const urlPage = "/d/master-data/question";
  const local = useLocal({
    can_add: false,
    can_edit: false,
    roles: null as any,
    ready: false as boolean,
  });
  useEffect(() => {
    const run = async () => {
      // local.ready = false;
      // local.render();
      local.can_add = true;
      local.ready = true;
      local.render();
    };
    run();
  }, []);
  if (local.ready && !local.can_add) return notFound();
  return (
    <FormBetter
      onTitle={(fm: any) => {
        return (
          <div className="flex flex-row w-full">
            <div className="flex flex-col py-4 pt-0 pb-0 flex-grow">
              <h2 className="text-xl font-semibold text-gray-900">
                <span className="">{labelPage}</span>
              </h2>
              <BreadcrumbBetterLink
                data={[
                  {
                    title: `List ${labelPage}`,
                    url: urlPage,
                  },
                  {
                    title: "New",
                  },
                ]}
              />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              <Alert
                type={"save"}
                msg={"Are you sure you want to save this new record?"}
                onClick={() => {
                  fm.submit();
                }}
              >
                <ButtonContainer className={"bg-primary"}>
                  <IoMdSave className="text-xl" />
                  Save
                </ButtonContainer>
              </Alert>
            </div>
          </div>
        );
      }}
      onSubmit={async (fm: any) => {
        const res = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/template-questions",
          method: "post",
          data: {
            name: fm.data?.name,
            document_setup_id: fm.data?.document_setup_id,
            duration: fm.data?.duration,
            description: fm.data?.description, // optional
            status: fm.data?.status === "ACTIVE" ? fm.data?.status : "INACTIVE",
            form_type: fm.data?.form_type,
          },
        });
        navigate("/d/master-data/question/" + res.id + "/edit");
      }}
      onLoad={async () => {
        const res: any = await apix({
          port: "recruitment",
          value: "data.data",
          path: "/api/answer-types",
          validate: "array",
        });
        const result = res.map((e: any) => {
          return {
            value: e.id,
            label: `${e.name}`,
          };
        });
        return {
          list_answer_type: result,
          template_question: [],
          header: `<p style="text-align: right">Jakarta, {date}</p><p>Nomor : {document_number}</p><p>Perihal : Offering Letter – Management Training Program</p>`,
          notes:
            "<p>Sdr/i <strong>{full name}</strong></p><p>Di Tempat.</p><p>&nbsp;</p><p>Dengan sangat senang hati kami Julong Group Wilayah Indonesia {company} mengabarkan bahwa Anda diterima sebagai Peserta Management Training di perusahaan kami dengan keterangan seperti di bawah ini ：</p><p><strong>&nbsp;</strong></p><p><strong>Status</strong></p><p>Status Anda adalah sebagai <strong>{job_name} </strong>di {company}, Julong Group Indonesia.</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p><strong>Uang Saku, Fasilitas Tempat Tinggal dan Makan</strong></p><p>Selama mengikuti Program Management Training kami memberikan uang saku sejumlah <strong>Rp. {salary},-</strong> ({salary_text}) per bulan. PPh 21 ditanggung oleh Perusahaan. Perusahaan juga memberikan fasilitas tempat tinggal (mess) dan makan.</p><p>&nbsp;</p><p><strong>Jaminan Sosial</strong></p><p>Selama menjalani masa Program Management Training, Perusahaan akan mengikutsertakan Peserta pada Program BPJS Kesehatan, BPJS Ketenagakerjaan berupa Jaminan Kecelakaan Kerja (JKK) dan Jaminan Kematian (JKM).</p><p>&nbsp;</p><p><strong>Ketentuan Management Training</strong></p><p><strong>A.&nbsp;Persyaratan</strong></p><ul><li><p>Bersedia mengikuti pendidikan Program MT di&nbsp; selama 7,5 bulan.</p></li><li><p>Selama pelaksanaan program diberlakukan sistem gugur berdasarkan evaluasi per 3 bulan.</p></li><li><p>Bersedia menjalani ikatan dinas selama 3 tahun sejak hari pertama mengikuti Program MT.</p></li><li><p>Bersedia menyerahkan ijazah terakhir asli kepada Perusahaan selama ikatan dinas.</p></li><li><p>Sehat jasmani dan rohani dibuktikan dengan surat keterangan sehat dari Dokter.</p></li><li><p>Memberikan surat ijin dari orang tua (bermaterai).</p></li><li><p>Bersedia mematuhi tata tertib selama mengikuti Program MT.</p></li><li><p>Jika lulus masa training 7,5 bulan, bersedia ditempatkan di seluruh area Perusahaan.</p></li><li><p>Menyetujui dan berkomitmen untuk memenuhi semua ketentuan yang ditetapkan dalam Offering Letter ini.</p></li><li><p>Menyetujui surat pernyataan dan perjanjian ikatan dinas (bermaterai).</p></li></ul><p>&nbsp;</p><p><strong>B.&nbsp;Ketentuan Ikatan Dinas</strong></p><ul><li><p>Peserta yang lulus mengikuti program MT akan dikenakan kewajiban ikatan dinas.</p></li><li><p>Masa ikatan dinas adalah 3 tahun sejak hari pertama mengikuti Program MT.</p></li><li><p>Memberlakukan penalti sebesar<strong> Rp. {penalty},- ({penalty_text})</strong> apabila mengundurkan diri selama masa pelatihan MT maka akan dikenakan penalti penuh sedangkan jika mengundurkan diri setelah lulus masa pelatihan MT maka akan dikenakan penalty proporsional sesuai masa pengabdian yang dijalani.</p></li></ul><p>&nbsp;</p><p><strong>C.&nbsp;Tahapan Program</strong></p><ol><li><p>In Class Training &amp; Bimbingan Mental dan Fisik</p><ul><li><p>Kegiatan akan berlangsung selama +/- 1 bulan.</p></li><li><p>Kegiatannya berupa pelatihan teori kelas dan praktek lapangan.</p></li></ul></li><li><p>On the Job Training</p><ul><li><p>Kegiatan akan berlangsung selama +/- 1 bulan.</p></li><li><p>Kegiatannya berupa pelatihan teori kelas dan praktek lapangan.</p></li></ul></li><li><p>OJT dilakukan secara bertahap (OJT Tahap 1 dan OJT Tahap 2) selama 6 bulan.</p><ul><li><p>Tiap tahapan berlangsung 3 bulan dan dilakukan evaluasi berupa penilaian kinerja harian, panel presentasi, ujian tulis, dan laporan makalah.</p></li><li><p>Selama pelaksanaan OJT, Peserta sudah menjalankan tugas pokok &amp; fungsi Staff di bawah bimbingan Mentor.</p></li><li><p>Selama pelaksanaan OJT, Peserta wajib melakukan improvisasi/inovasi yang harus dipresentasikan tiap akhir tahapan OJT.</p></li><li><p>Lokasi OJT dan penempatan ditentukan oleh perusahaan.</p></li></ul></li></ol><p>&nbsp;</p><p><strong>D.&nbsp;Pengangkatan Karyawan</strong></p><p>Apabila Peserta mampu melewati masa pendidikan Program MT dan LULUS maka akan diangkat menjadi Karyawan Tetap Perusahaan, level staff dengan jabatan Field Conductor (FC) Golongan 3C.</p><p>&nbsp;</p><p><strong>Lapor Kedatangan</strong></p><p>Lokasi dan Waktu :</p><p>Anda dipersilakan untuk melaporkan kedatangan kepada <strong>Bagian HRD</strong> selambat-lambatnya <strong>.</strong></p><p>&nbsp;</p><p>Alamat :</p><p><strong>JULONG GROUP INDONESIA</strong></p><p>KEM Tower Lantai 5</p><p>Jalan Ladasan Pacu Barat Blok B10 Kav. 2,</p><p>Kota Baru Bandar, Kemayoran – Jakarta Pusat 10610</p><p>Telp / Fax : 021 – 65703998 / 021 - 65703954</p><p>CP HRD : Bpk Johannes H.S. Rorimpandey&nbsp; 0813-41230844</p><p>&nbsp;</p><p><strong>Syarat-syarat lapor kedatangan :</strong></p><strong><ol><li><p><strong>Ijazah terakhir asli</strong></p></li><li><p><strong>Surat ijin orang tua bermaterai</strong></p></li><li><p><strong>Fotocopy ijazah 1 rangkap</strong></p></li><li><p><strong>Fotocopy transkrip nilai 1 rangkap</strong></p></li><li><p><strong>KTP (Fotokopi) 1 rangkap</strong></p></li><li><p><strong>Pas foto berwarna&nbsp; 2x3 =2 lembar dan 4x6= 2 lembar</strong></p></li><li><p><strong>Surat Pengalaman Kerja (Fotokopi) (Jika Ada)</strong></p></li><li><p><strong>Surat Keterangan Sehat dari Dokter / RS setempat</strong></p></li><li><p><strong>Fotocopy Buku Rek Bank BNI</strong></p></li><li><p><strong>Fotocopy Kartu Keluarga</strong></p></li><li><p><strong>Fotocopy NPWP 1 Lembar (Jika Ada)</strong></p></li><li><p><strong>Fotocopy Kartu BPJS (Ketenagakerjaan &amp; Kesehatan) 1 Lembar (Jika Ada)</strong></p></li></ol></strong>",
          footer: `<p>Jakarta, {date}</p><p></p><table class="my-custom-class" style="min-width: 735px"><colgroup><col style="width: 133px"><col style="width: 577px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1" colwidth="133" class="tiptap-border-none"><p>Disetujui Oleh,</p></th><th colspan="1" rowspan="1" colwidth="577" class="tiptap-border-none"><p></p></th><th colspan="1" rowspan="1" class="tiptap-border-none"><p>Diterima Oleh,</p></th></tr><tr><td colspan="1" rowspan="1" colwidth="133" class="tiptap-border-none"><p></p><p></p><p></p><p></p><p></p><p></p><p></p></td><td colspan="1" rowspan="1" colwidth="577" class="tiptap-border-none"><p></p></td><td colspan="1" rowspan="1" class="tiptap-border-none"><p></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="133" class="tiptap-border-none"><p><u><strong>{receiver_name}</strong></u></p><p>Penerima</p></td><td colspan="1" rowspan="1" colwidth="577" class="tiptap-border-none"><p></p></td><td colspan="1" rowspan="1" class="tiptap-border-none"><p><u><strong>{approval_name}</strong></u></p><p>{job_name}</p></td></tr></tbody></table>`,
        };
      }}
      showResize={false}
      header={(fm: any) => {
        return <></>;
      }}
      children={(fm: any) => {
        return (
          <>
            <div className={cx("flex flex-col flex-wrap px-4 py-2")}>
              <div className="grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8">
                <div>
                  <Field
                    fm={fm}
                    name={"name"}
                    label={"Template"}
                    type={"text"}
                  />
                </div>
                <div>
                  <Field
                    fm={fm}
                    name={"form_type"}
                    label={"Document Type"}
                    type={"dropdown-async"}
                    pagination={false}
                    search={"local"}
                    onChange={() => {
                      if (
                        typeof fm?.fields?.document_setup?.reload === "function"
                      ) {
                        fm.fields.document_setup.reload();
                      }
                    }}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "recruitment",
                        value: "data.data",
                        path: `/api/template-questions/form-types${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={(item: any) =>
                      typeof item === "string"
                        ? labelDocumentType(item)
                        : labelDocumentType(get(item, "value"))
                    }
                    onValue={"value"}
                  />
                </div>
                {["CONTRACT_DOCUMENT", "OFFERING_LETTER"].includes(
                  fm?.data?.form_type
                ) && (
                  <div>
                    <Field
                      fm={fm}
                      target={"document_setup_id"}
                      name={"document_setup"}
                      label={"Document Title - Recruitment Type"}
                      type={"dropdown-async"}
                      onLoad={async (param: any) => {
                        if (!fm?.data?.form_type) return [];
                        const params = await events("onload-param", {
                          ...param,
                          name: fm?.data?.form_type,
                        });
                        const res: any = await apix({
                          port: "recruitment",
                          value: "data.data.document_setups",
                          path: `/api/document-setup${params}`,
                          validate: "array",
                        });
                        return res;
                      }}
                      onLabel={(item: any) => get(item, "title")}
                    />
                  </div>
                )}
                <div>
                  <Field
                    fm={fm}
                    name={"description"}
                    label={"Description"}
                    type={"textarea"}
                  />
                </div>

                <div>
                  <Field
                    fm={fm}
                    name={"status"}
                    hidden_label={true}
                    label={""}
                    type={"single-checkbox"}
                    onLoad={() => {
                      return [
                        {
                          label: "Active",
                          value: "ACTIVE",
                        },
                      ];
                    }}
                  />
                </div>
                <div>
                  {["TEST", "INTERVIEW", "FGD", "FINAL_INTERVIEW"].includes(
                    fm?.data?.form_type
                  ) && (
                    <Field
                      fm={fm}
                      name={"duration"}
                      label={"Duration (minute)"}
                      type={"money"}
                      suffix={
                        <div className="text-md flex flex-row items-center font-bold">
                          minute
                        </div>
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

export default Page;
