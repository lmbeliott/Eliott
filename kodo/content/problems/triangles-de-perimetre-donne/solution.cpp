#include <iostream>
using namespace std;

int main() {
    int p;
    cin >> p;
    int nombre = 0;
    int a = 1;
    while (3 * a <= p) {              // a est le plus petit côté
        int b = a;
        while (a + 2 * b <= p) {      // b <= c
            int c = p - a - b;
            if (a + b > c) {
                nombre = nombre + 1;
            }
            b = b + 1;
        }
        a = a + 1;
    }
    cout << nombre << "\n";
    return 0;
}
