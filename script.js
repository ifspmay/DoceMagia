const btnInicio = document.getElementById("btnInicio");
const btnProdutos = document.getElementById("btnProdutos");
const btnIngredientes = document.getElementById("btnIngredientes");
const btnClientes = document.getElementById("btnClientes");
const btnEncomendas = document.getElementById("btnEncomendas");
const btnVendaBalcao = document.getElementById("btnVendaBalcao");
const btnRelatorios = document.getElementById("btnRelatorios");

const telaInicio = document.getElementById("Inicio");
const telaProdutos = document.getElementById("Produtos");
const telaIngredientes = document.getElementById("Ingredientes");
const telaClientes = document.getElementById("Clientes");
const telaEncomendas = document.getElementById("Encomendas");
const telaVendaBalcao = document.getElementById("VendaBalcão");
const telaRelatorios = document.getElementById("Relatorios");

const btnNovoProduto = document.getElementById("btnNovoProduto");
const btnFecharNovoProduto = document.getElementById("btnFecharNovoProduto");
const listaProdutos = document.getElementById("produtosLista");
const formularioProduto = document.getElementById("NovoProduto");

const btnNovoIngrediente = document.getElementById("btnNovoIngrediente");
const btnFecharNovoIngrediente = document.getElementById(
  "btnFecharNovoIngrediente",
);
const listaIngredientes = document.getElementById("listaIngredientes");
const formularioIngrediente = document.getElementById("NovoIngrediente");

const btnReabastecer = document.getElementById("btnReabastecer");
const btnFecharReabastecer = document.getElementById("btnFecharReabastecer");
const formularioReabastecer = document.getElementById("Reabastecer");

const btnNovoCliente = document.getElementById("btnNovoCliente");
const btnFecharNovoCliente = document.getElementById("btnFecharNovoCliente");
const listaClientes = document.getElementById("listaClientes");
const formularioCliente = document.getElementById("NovoCliente");

const btnNovaEncomenda = document.getElementById("btnNovaEncomenda");
const btnFecharNovaEncomenda = document.getElementById(
  "btnFecharNovaEncomenda",
);
const listaEncomendas = document.getElementById("listaEncomendas");
const formularioEncomenda = document.getElementById("NovaEncomenda");

function mostrarTela(telaAtiva) {
  telaInicio.classList.remove("active");
  telaProdutos.classList.remove("active");
  telaIngredientes.classList.remove("active");
  telaClientes.classList.remove("active");
  telaEncomendas.classList.remove("active");
  telaVendaBalcao.classList.remove("active");
  telaRelatorios.classList.remove("active");

  btnInicio.classList.remove("active");
  btnProdutos.classList.remove("active");
  btnIngredientes.classList.remove("active");
  btnClientes.classList.remove("active");
  btnEncomendas.classList.remove("active");
  btnVendaBalcao.classList.remove("active");
  btnRelatorios.classList.remove("active");

  if (telaAtiva === "Inicio") {
    telaInicio.classList.add("active");
    btnInicio.classList.add("active");
  } else if (telaAtiva === "Produtos") {
    telaProdutos.classList.add("active");
    btnProdutos.classList.add("active");
  } else if (telaAtiva === "Ingredientes") {
    telaIngredientes.classList.add("active");
    btnIngredientes.classList.add("active");
  } else if (telaAtiva === "Clientes") {
    telaClientes.classList.add("active");
    btnClientes.classList.add("active");
  } else if (telaAtiva === "Encomendas") {
    telaEncomendas.classList.add("active");
    btnEncomendas.classList.add("active");
  } else if (telaAtiva === "VendaBalcão") {
    telaVendaBalcao.classList.add("active");
    btnVendaBalcao.classList.add("active");
  } else if (telaAtiva === "Relatorios") {
    telaRelatorios.classList.add("active");
    btnRelatorios.classList.add("active");
  }
}

btnInicio.addEventListener("click", function () {
  mostrarTela("Inicio");
});

btnProdutos.addEventListener("click", function () {
  mostrarTela("Produtos");
});

btnIngredientes.addEventListener("click", function () {
  mostrarTela("Ingredientes");
});

btnClientes.addEventListener("click", function () {
  mostrarTela("Clientes");
});

btnEncomendas.addEventListener("click", function () {
  mostrarTela("Encomendas");
});

btnVendaBalcao.addEventListener("click", function () {
  mostrarTela("VendaBalcão");
});

btnRelatorios.addEventListener("click", function () {
  mostrarTela("Relatorios");
});

btnNovoProduto.addEventListener("click", function () {
  listaProdutos.classList.remove("active");
  formularioProduto.classList.add("active");
});

btnFecharNovoProduto.addEventListener("click", function () {
  formularioProduto.classList.remove("active");
  listaProdutos.classList.add("active");
});

btnNovoIngrediente.addEventListener("click", function () {
  listaIngredientes.classList.remove("active");
  formularioIngrediente.classList.add("active");
});

btnFecharNovoIngrediente.addEventListener("click", function () {
  formularioIngrediente.classList.remove("active");
  listaIngredientes.classList.add("active");
});

btnReabastecer.addEventListener("click", function () {
  listaIngredientes.classList.remove("active");
  formularioReabastecer.classList.add("active");
});

btnFecharReabastecer.addEventListener("click", function () {
  formularioReabastecer.classList.remove("active");
  listaIngredientes.classList.add("active");
});

btnNovoCliente.addEventListener("click", function () {
  listaClientes.classList.remove("active");
  formularioCliente.classList.add("active");
});

btnFecharNovoCliente.addEventListener("click", function () {
  formularioCliente.classList.remove("active");
  listaClientes.classList.add("active");
});

btnNovaEncomenda.addEventListener("click", function () {
  listaEncomendas.classList.remove("active");
  formularioEncomenda.classList.add("active");
});

btnFecharNovaEncomenda.addEventListener("click", function () {
  formularioEncomenda.classList.remove("active");
  listaEncomendas.classList.add("active");
});
