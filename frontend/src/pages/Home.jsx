import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Tag from "../components/Tag";
import ToDoCheckbox from "../components/ToDoCheckbox";

// Chỉ cần gọi component và đưa vào các props cần thiết
function Home() {
  return (
    <div className="flex-col space-y-10">
      <section>
        <h2>Buttons</h2>
        {/*Chọn 1 variant: default, outline, text, fab. Nếu không chọn sẽ mặc định chọn default*/}
        <div class="row">
          <Button>Blank</Button>
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="text">Text</Button>
          <Button variant="fab">+</Button>
        </div>
      </section>

      <section>
        <h2>Cards</h2>
        {/*Chỉ cần thay đổi props today (today=true hoặc today=false) là được*/}
        <div class="row">
          <Card title="Uống nước" caption="8/8 ly hôm nay" />
          <Card title="Hôm nay" caption="Ngày 14 · Rụng trứng" today />
        </div>
      </section>

      <section>
        <h2>Inputs</h2>
        {/*Muốn hiển thị input bị lỗi, thêm props error vào trong Input*/}
        <div class="row">
          <Input placeholder="Thêm nhiệm vụ mới..." />
          <Input
            error="Vui lòng nhập nội dung"
            placeholder="Thêm nhiệm vụ mới..."
          />
        </div>
      </section>

      <section>
        <h2>To-do checkbox</h2>
        {/*Chỉ cần thay đổi props checked (checked=true hoặc checked=false) là được*/}
        <ToDoCheckbox text="Uống thuốc vitamin" />
        <ToDoCheckbox text="Tập yoga 15 phút" checked />
      </section>

      <section>
        <h2>Tags / Badges</h2>
        {/*Chọn 1 variant: happy, calm, neutral, stressed, streak. Nếu không chọn sẽ mặc định chọn happy*/}
        <div class="row">
          <Tag />
          <Tag variant="happy" />
          <Tag variant="calm" />
          <Tag variant="neutral" />
          <Tag variant="stressed" />
          <Tag variant="streak" />
        </div>
      </section>
    </div>
  );
}

export default Home;
