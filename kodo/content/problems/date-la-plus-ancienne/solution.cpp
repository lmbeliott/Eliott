#include <iostream>
using namespace std;

int main() {
    int j1, m1, a1, j2, m2, a2;
    cin >> j1 >> m1 >> a1 >> j2 >> m2 >> a2;
    // L'année décide d'abord, puis le mois, puis le jour.
    if (a1 < a2) {
        cout << j1 << " " << m1 << " " << a1 << "\n";
    } else if (a1 > a2) {
        cout << j2 << " " << m2 << " " << a2 << "\n";
    } else if (m1 < m2) {
        cout << j1 << " " << m1 << " " << a1 << "\n";
    } else if (m1 > m2) {
        cout << j2 << " " << m2 << " " << a2 << "\n";
    } else if (j1 <= j2) {
        cout << j1 << " " << m1 << " " << a1 << "\n";
    } else {
        cout << j2 << " " << m2 << " " << a2 << "\n";
    }
    return 0;
}
