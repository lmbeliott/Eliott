#include <iostream>
using namespace std;

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long a, b;
        cin >> a >> b;
        int distance = 0;
        while (a != b) {
            if (a > b) a /= 2;   // le plus grand n'est pas un ancêtre de l'autre : il monte
            else b /= 2;
            distance++;
        }
        cout << a << " " << distance << "\n";
    }
    return 0;
}
