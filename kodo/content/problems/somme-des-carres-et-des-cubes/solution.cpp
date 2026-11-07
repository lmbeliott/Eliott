#include <iostream>
using namespace std;

int main() {
    int carres = 0;
    int cubes = 0;
    for (int i = 1; i <= 100; i++) {
        carres = carres + i * i;
        cubes = cubes + i * i * i;
    }
    // Après la boucle : les deux totaux.
    cout << carres << "\n";
    cout << cubes << "\n";
    return 0;
}
