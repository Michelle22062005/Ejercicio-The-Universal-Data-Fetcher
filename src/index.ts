//fetch

interface ApiResponse<T> {
    data:T | null;  //esto es el cuerpo del body en caso tal de que salga bien
    error:string | null; //error en caso tal de que salga mal
    status:number;  //codigo http [200, 400, 401, 500]
}

async function fetchData<T>(url:string): Promise<ApiResponse<T>>{
    try {
        const res = await fetch(url);
        // const res = await fetch("https://jsonplaceholder.typicode.com, {
        //     method: "POST")

        if (!res.ok) {
            return {
                data:null,
                error: `Error a la hora de hacer la peticion: ${res.statusText}`,
                status: res.status
            }
        }

        const body: unknown = await res.json();

        if (body === null || body === undefined) {
            return{
                data:null,
                error: "Error en la petición",
                status: res.status
            };
        }

        return {
            data:body as T,
            error:null,
            status:res.status
        }
    } catch (error) {
        //se nos cayo el internet
        return{
            data:null,
            error:"fallo la conexion total, compre internet",
            status: 500
        };
    }
}

class ApiService<T>{
    private url:string;
    constructor(url:string){
        this.url = url;
    }
    //methodos
    async getAll(): Promise<ApiResponse<T[]>>{
        const res = await fetchData<T[]>(this.url as unknown as string);
        return{
            data:res.data? res.data : null,
            error: res.error,
            status: res.status
        };
    }
    async getOne(id:number):Promise<ApiResponse<T>>{
       return await fetchData<T>(`${this.url}/${id}` as unknown as string);

    };
}

type Usuario={
    id:number;
    name:string;
}

async function main(){
    const usuarioService  = new ApiService<Usuario>('http://localhost:3000/api/users');
    //getAll
    usuarioService.getAll().then(res => {
    console.log("Usuarios:", res.data);   
});
//getOne válido
    usuarioService.getOne(1).then(res => {
        console.log("Usuario 1:", res.data);
    });
   //getOne inválido
    usuarioService.getOne(99999).then(res => {
    if (res.error) {
        console.log("Error controlado:", res.error);
    }
});
}
main();


