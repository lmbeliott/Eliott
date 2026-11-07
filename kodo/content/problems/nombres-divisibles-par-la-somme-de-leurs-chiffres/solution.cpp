#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    int nombre = 0;
    for (int n = a; n <= b; n++) {
        int m = n;            // copie : la boucle while la détruit
        int s = 0;            // somme des chiffres de n
        while (m > 0) {
            s = s + m % 10;
            m = m / 10;
        }
        if (n % s == 0) {
            nombre = nombre + 1;
        }
    }
    cout << nombre << "\n";
    return 0;
}
